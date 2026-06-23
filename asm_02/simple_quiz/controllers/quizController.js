const https = require('https');
const axios = require('axios');
const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

// Axios instance — rejectUnauthorized: false cho phép dùng self-signed cert (HTTPS)
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
});
const apiUrl = process.env.API_URL || 'http://localhost:3000';

// =========================================================================
// GIAO DIỆN (RENDER VIEWS — Dùng Axios gọi API)
// =========================================================================

// GET /quizzes
exports.renderQuizList = async (req, res) => {
    try {
        const response = await axiosInstance.get(`${apiUrl}/quizzes/api/quizzes`);
        res.render('quizzes/list', { quizzes: response.data });
    } catch (err) {
        res.status(500).send("Lỗi Server: " + err.message);
    }
};

// GET /quizzes/create
exports.renderQuizCreate = (req, res) => {
    res.render('quizzes/create');
};

// GET /quizzes/:id/edit
exports.renderQuizEdit = async (req, res) => {
    try {
        const response = await axiosInstance.get(`${apiUrl}/quizzes/api/quizzes/${req.params.id}`);
        res.render('quizzes/edit', { quiz: response.data });
    } catch (err) {
        res.status(500).send("Lỗi Server: " + err.message);
    }
};

// GET /quizzes/:id/details
exports.renderQuizById = async (req, res) => {
    try {
        const response = await axiosInstance.get(`${apiUrl}/quizzes/api/quizzes/${req.params.id}`);
        res.render('quizzes/details', { quiz: response.data });
    } catch (err) {
        res.status(500).send("Lỗi Server: " + err.message);
    }
};

// POST /quizzes/create
exports.handleCreateQuizForm = async (req, res) => {
    try {
        await axiosInstance.post(`${apiUrl}/quizzes/api/quizzes`, req.body);
        res.redirect('/quizzes');
    } catch (err) {
        res.status(400).send("Lỗi dữ liệu: " + err.message);
    }
};

// POST /quizzes/:id/edit
exports.handleUpdateQuizForm = async (req, res) => {
    try {
        await axiosInstance.put(`${apiUrl}/quizzes/api/quizzes/${req.params.id}`, {
            title: req.body.title,
            description: req.body.description
        });
        res.redirect('/quizzes');
    } catch (err) {
        res.status(400).send(err.message);
    }
};

// DELETE /quizzes/:id
exports.deleteQuizUI = async (req, res) => {
    try {
        await axiosInstance.delete(`${apiUrl}/quizzes/api/quizzes/${req.params.id}`);
        res.redirect('/quizzes');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// =========================================================================
// API ENDPOINTS (Postman / Axios — Trả về JSON, dùng Mongoose trực tiếp)
// =========================================================================

exports.getAllQuizzesAPI = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('questions');
        res.status(200).json(quizzes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getQuizByIdAPI = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id).populate('questions');
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        res.status(200).json(quiz);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createQuizAPI = async (req, res) => {
    try {
        const newQuiz = new Quiz(req.body);
        const savedQuiz = await newQuiz.save();
        res.status(201).json(savedQuiz);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateQuizAPI = async (req, res) => {
    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json(updatedQuiz);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteQuizAPI = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: "Không tìm thấy bộ đề để xóa" });
        await Question.deleteMany({ _id: { $in: quiz.questions } });
        await Quiz.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: "Xóa bộ đề và các câu hỏi thành công!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getQuizWithCapitalQuestions = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId).populate({
            path: 'questions',
            match: { text: { $regex: 'capital', $options: 'i' } }
        });
        if (!quiz) return res.status(404).json({ message: 'Không tìm thấy bộ đề' });
        res.status(200).json(quiz);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.addSingleQuestionToQuiz = async (req, res) => {
    try {
        const newQuestion = await Question.create(req.body);
        await Quiz.findByIdAndUpdate(req.params.quizId, { $push: { questions: newQuestion._id } });
        res.status(201).json(newQuestion);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.addMultipleQuestionsToQuiz = async (req, res) => {
    try {
        const savedQuestions = await Question.insertMany(req.body);
        const questionIds = savedQuestions.map(q => q._id);
        await Quiz.findByIdAndUpdate(req.params.quizId, { $push: { questions: { $each: questionIds } } });
        res.status(200).json({ message: "Đã thêm hàng loạt câu hỏi thành công." });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
