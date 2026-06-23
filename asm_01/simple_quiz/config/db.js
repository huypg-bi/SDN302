const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Kết nối đến database mang tên SimpleQuiz theo yêu cầu
        await mongoose.connect('mongodb://localhost:27017/SimpleLove');
        console.log('MongoDB Connected Successfully to SimpleLove database...');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;