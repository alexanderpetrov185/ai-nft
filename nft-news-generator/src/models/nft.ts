import mongoose, { Schema, Document } from 'mongoose';

/**
 * Интерфейс для описания структуры данных NFT в базе данных.
 */
export interface INFT extends Document {
    title: string;          // Заголовок новости
    description: string;    // Описание новости
    imageUrl: string;       // URL сгенерированного изображения
    createdAt: Date;        // Дата создания
    blockchainId: string;   // ID токена в блокчейне
}

/**
 * Схема базы данных для NFT.
 */
const NFTSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    createdAt: { type: Date, default: Date.now },
    blockchainId: { type: String, required: true },
});

/**
 * Экспортируем модель NFT для использования в других модулях.
 */
export default mongoose.model<INFT>('NFT', NFTSchema);
