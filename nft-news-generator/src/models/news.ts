// src/models/news.ts
import mongoose, { Schema, Document } from 'mongoose';

export interface INews extends Document {
    title: string;
    description: string;
    imageUrl: string;
    publishedAt: Date;
}

const NewsSchema: Schema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    imageUrl: { type: String, required: true },
    publishedAt: { type: Date, default: Date.now },
});

export default mongoose.model<INews>('News', NewsSchema);
