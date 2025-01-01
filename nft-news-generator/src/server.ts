import express, { Application } from 'express';
import dotenv from 'dotenv';
import connectDB from './config/db';
import nftRoutes from './routes/nftRoutes';

dotenv.config();

const app: Application = express();
const PORT = process.env.PORT || 3000;

// Подключение к базе данных
connectDB();

// Middleware
app.use(express.json());

// Роуты
app.use('/api/nfts', nftRoutes);

// Запуск сервера
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
