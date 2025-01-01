import axios from 'axios';

const API_KEY = process.env.MEDIASTACK_API_KEY;

export interface NewsArticle {
    title: string;
    description: string;
    url: string;
    image: string;
    published_at: string;
}

/**
 * Получение новостей из Mediastack API.
 * @param query Ключевое слово для поиска новостей.
 * @returns Список новостных статей.
 */
export const fetchMediastackNews = async (query: string): Promise<NewsArticle[]> => {
    const BASE_URL = 'http://api.mediastack.com/v1/news';

    try {
        const response = await axios.get(BASE_URL, {
            params: {
                access_key: API_KEY,
                keywords: query,
                languages: 'en', // Используем английский язык для поиска.
                sort: 'published_desc',
                limit: 10, // Ограничиваем количество результатов.
            },
        });

        return response.data.data.map((item: any) => ({
            title: item.title,
            description: item.description || '',
            url: item.url,
            image: item.image || '', // У Mediastack не всегда есть изображение.
            published_at: item.published_at,
        }));
    } catch (error) {
        console.error('Ошибка при получении новостей из Mediastack:', error);
        throw new Error('Не удалось получить новости из Mediastack API');
    }
};
