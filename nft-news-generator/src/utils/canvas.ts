import {createCanvas, CanvasRenderingContext2D, loadImage} from 'canvas';
import path from 'path';

/**
 * Генерирует изображение для NFT на основе данных (заголовка, описания и URL картинки).
 * @param title Заголовок новости.
 * @param description Описание новости.
 * @param imageUrl URL изображения (опционально).
 * @returns Буфер изображения (Buffer).
 */
export const generateNFTImage = async (
    title: string,
    description: string,
    imageUrl?: string
): Promise<Buffer> => {
    const canvas = createCanvas(500, 500); // Создаем холст размером 500x500
    const ctx = canvas.getContext('2d');

    // Заливаем фон
    ctx.fillStyle = '#f5f5f5'; // Светлый бежевый фон
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Рисуем рамку в стиле почтовой марки
    ctx.strokeStyle = '#000'; // Черная рамка
    ctx.lineWidth = 10;
    ctx.strokeRect(10, 10, 480, 480); // Рамка отступает на 10px от края

    // Загружаем изображение, если есть
    if (imageUrl) {
        try {
            const img = await loadImage(imageUrl);
            ctx.drawImage(img, 50, 50, 400, 200); // Рисуем изображение внутри рамки
        } catch (err) {
            console.warn('Ошибка загрузки изображения:', err);
        }
    }

    // Добавляем заголовок
    ctx.fillStyle = '#000';
    ctx.font = 'bold 20px Arial';
    ctx.fillText(title, 20, 300); // Пишем заголовок ниже изображения

    // Добавляем описание
    ctx.font = '16px Arial';
    const wrappedText = wrapText(ctx, description, 20, 350, 460, 20);
    wrappedText.forEach((line, i) => ctx.fillText(line, 20, 350 + i * 25)); // Разбиваем текст на строки

    // Возвращаем изображение в формате Buffer
    return canvas.toBuffer('image/png');
};

/**
 * Помощник для переноса текста на несколько строк.
 */
function wrapText(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number): string[] {
    const words = text.split(' ');
    const lines: string[] = [];
    let currentLine = '';

    words.forEach(word => {
        const testLine = currentLine + word + ' ';
        const metrics = ctx.measureText(testLine);
        if (metrics.width > maxWidth) {
            lines.push(currentLine.trim());
            currentLine = word + ' ';
        } else {
            currentLine = testLine;
        }
    });

    if (currentLine.trim() !== '') {
        lines.push(currentLine.trim());
    }

    return lines;
}
