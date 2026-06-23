const mongoose = require('mongoose');

const QuestionSchema = new mongoose.Schema({
    text: { type: String, required: true }, // Nội dung câu hỏi 
    options: [{ type: String, required: true }], // Mảng các đáp án lựa chọn 
    keywords: [{ type: String }], // Mảng từ khóa 
    correctAnswerIndex: { type: Number, required: true } // Chỉ số đáp án đúng 
});

module.exports = mongoose.model('Question', QuestionSchema);