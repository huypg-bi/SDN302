const express = require('express');
const connectDB = require('./config/db');
const quizRoutes = require('./routes/quizRoutes');
const questionRoutes = require('./routes/questionRoutes');

const app = express();

// Kết nối Cơ sở dữ liệu MongoDB
connectDB();

// Middleware để đọc dữ liệu JSON gửi lên từ Postman
app.use(express.json());

// Khai báo sử dụng các Routes chuẩn REST API 
app.use('/quizzes', quizRoutes);
app.use('/questions', questionRoutes);

// Khởi chạy Server ở cổng 3000
const PORT = 3000;
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});