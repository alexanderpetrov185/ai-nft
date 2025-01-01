import mongoose from 'mongoose';

const connectDB = async () => {
    try {
        const mongoURI = process.env.MONGO_URI || 'mongodb+srv://admin:fackyou123fackffs@cluster0.a0p2j.mongodb.net/';
        await mongoose.connect(mongoURI); // useNewUrlParser и другие параметры больше не нужны
        console.log('MongoDB connected successfully!');
    } catch (err) {
        console.error('MongoDB connection error:', err);
        process.exit(1); // Завершает процесс, если подключение не удалось
    }
};

export default connectDB;
