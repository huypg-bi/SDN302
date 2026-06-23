const mongoose = require('mongoose');

const QuizSchema = new mongoose.Schema({
    title: { type: String, required: true }, // Tiêu đề bộ đề 
    description: { type: String }, // Mô tả bộ đề 
    // Mảng chứa các ID của câu hỏi liên kết tới bảng Question 
    questions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Question' }] 
});

module.exports = mongoose.model('Quiz', QuizSchema);