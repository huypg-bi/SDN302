const Question = require('../models/Question');

// GET /question - Lấy toàn bộ câu hỏi
exports.getAllQuestions = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /questions/:questionId
exports.getQuestionById = async (req, res) => {
    try {
        const question = await Question.findById(req.params.questionId);

        if (!question) {
            return res.status(404).json({
                message: 'Question not found'
            });
        }

        res.status(200).json(question);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// POST /question - Tạo một câu hỏi đơn lẻ độc lập
exports.createQuestion = async (req, res) => {
    try {
        const newQuestion = new Question(req.body);
        const savedQuestion = await Question.create(newQuestion);
        res.status(201).json(savedQuestion);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// PUT /question/:questionId - Cập nhật câu hỏi
exports.updateQuestion = async (req, res) => {
    try {
        const updatedQuestion = await Question.findByIdAndUpdate(
            req.params.questionId,
            req.body,
            { new: true }
        );
        res.status(200).json(updatedQuestion);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE /question/:questionId - Xóa câu hỏi
exports.deleteQuestion = async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.questionId);
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};