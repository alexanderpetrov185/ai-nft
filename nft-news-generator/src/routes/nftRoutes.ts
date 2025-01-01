import express, { Request, Response, Router } from 'express';
import { createNFT, getAllNFTs } from '../services/nftService';
import { INFT } from '../models/nft';
import {fetchMediastackNews, NewsArticle} from '../services/mediastackService';
import Joi from 'joi';
import { generateNFTImage } from '../utils/canvas';
import { mintNFT, generateWallet } from '../utils/solana';
import NFT from '../models/nft';


const router: Router = express.Router();

// Интерфейс для тела POST-запроса
interface CreateNFTBody {
    title: string;
    description: string;
    imageUrl: string;
}

const mediastackQuerySchema = Joi.object({
    query: Joi.string().required(), // query должен быть строкой и обязательным
});


/**
 * Получение всех NFT.
 */
router.get('/', async (req: Request, res: Response): Promise<void> => {
    try {
        const nfts: INFT[] = await getAllNFTs();
        res.status(200).json(nfts);
    } catch (error) {
        console.error('Ошибка при получении списка NFT:', error);
        res.status(500).json({ error: 'Не удалось получить список NFT' });
    }
});

/**
 * Создание нового NFT.
 */
router.post('/', async (req: Request<{}, {}, CreateNFTBody>, res: Response): Promise<void> => {
    try {
        const { title, description, imageUrl } = req.body;

        // Проверка входных данных
        if (!title || !description || !imageUrl) {
            res.status(400).json({ error: 'Все поля обязательны' });
            return;
        }

        // Создание NFT
        const nft = await createNFT({
            title,
            description,
            imageUrl,
        });
        res.status(201).json(nft);
    } catch (error) {
        console.error('Ошибка при создании NFT:', error);
        res.status(500).json({ error: 'Не удалось создать NFT' });
    }
});

router.post('/generate-mediastack', async (req: Request, res: Response): Promise<void> => {
    // Валидация тела запроса
    const { error } = mediastackQuerySchema.validate(req.body);

    if (error) {
        // Если данные не прошли проверку, отправляем ошибку клиенту
        res.status(400).json({ error: error.details[0].message });
        return;
    }

    // Основная логика...
    try {
        const { query } = req.body;
        const news: NewsArticle[] = await fetchMediastackNews(query);

        if (!news.length) {
            res.status(404).json({ error: 'Новости не найдены!' });
            return;
        }

        const article = news[0];
        const nft: INFT = await createNFT({
            title: article.title,
            description: article.description,
            imageUrl: article.image || '/images/default.jpg',
        });

        res.status(201).json(nft);
    } catch (error) {
        res.status(500).json({ error: 'Ошибка при генерации NFT' });
    }
});

router.post('/mint', async (req: Request, res: Response): Promise<void> => {
    try {
        // Получаем последнюю новость
        const news = await NFT.findOne().sort({ _id: -1 });
        if (!news) {
            res.status(404).json({ error: 'Нет новостей для создания NFT' });
            return;
        }

        console.log(news.title, news.description, news.imageUrl)

        // Генерируем изображение
        const imageBuffer = await generateNFTImage(news.title, news.description, news.imageUrl);

        // Генерируем новый кошелек и выпускаем NFT
        const wallet = generateWallet();
        const nftId = await mintNFT(wallet, imageBuffer);

        res.status(201).json({ message: 'NFT успешно выпущен!', nftId });
    } catch (error) {
        console.error('Ошибка выпуска NFT:', error);
        res.status(500).json({ error: 'Ошибка выпуска NFT' });
    }
});

export default router;
