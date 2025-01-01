import NFTModel, { INFT } from '../models/nft';

/**
 * Создаёт новый NFT в базе данных.
 * @param nftData Данные для создания NFT.
 * @returns Сохранённый объект NFT.
 */
export const createNFT = async (nftData: {
    title: string;
    description: string;
    imageUrl: string;
}): Promise<INFT> => {
    const nft = new NFTModel({
        ...nftData,
        blockchainId: generateBlockchainId(), // Генерация уникального ID токена
        createdAt: new Date(), // Установить дату создания
    });
    return await nft.save();
};

/**
 * Получает все NFT из базы данных.
 * @returns Список всех NFT.
 */
export const getAllNFTs = async (): Promise<INFT[]> => {
    return NFTModel.find();
};

/**
 * Пример функции генерации blockchainId.
 * На этапе интеграции замените на вызов API Solana.
 * @returns Уникальный идентификатор токена.
 */
const generateBlockchainId = (): string => {
    return `solana-${Date.now()}`;
};
