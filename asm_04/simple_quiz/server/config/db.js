const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        // Kết nối đến database SimpleQuiz
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/SimpleQuiz');
        console.log('MongoDB Connected Successfully to SimpleQuiz database...');
    } catch (err) {
        console.error('Database connection error:', err.message);
        process.exit(1);
    }
};

module.exports = connectDB;