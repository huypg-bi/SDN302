const https = require('https');
const axios = require('axios');
const Question = require('../models/Question');

// Axios instance — rejectUnauthorized: false cho phép dùng self-signed cert (HTTPS)
const axiosInstance = axios.create({
    httpsAgent: new https.Agent({ rejectUnauthorized: false })
});
const apiUrl = process.env.API_URL || 'http://localhost:3000';

// =========================================================================
// GIAO DIỆN (RENDER VIEWS — Dùng Axios gọi API)
// =========================================================================

// GET /questions
exports.renderQuestionList = async (req, res) => {
    try {
        const response = await axiosInstance.get(`${apiUrl}/questions/api/questions`);
        res.render('questions/list', { questions: response.data });
    } catch (err) {
        res.status(500).send("Lỗi Server: " + err.message);
    }
};

// GET /questions/:questionId
exports.renderQuestionDetail = async (req, res) => {
    try {
        const response = await axiosInstance.get(`${apiUrl}/questions/api/questions/${req.params.questionId}`);
        const question = response.data;
        // Tiền xử lý options để HBS template có thể hiển thị đáp án đúng
        question.optionsWithCorrect = question.options.map((text, i) => ({
            text,
            isCorrect: i === parseInt(question.correctAnswerIndex)
        }));
        res.render('questions/details', { question });
    } catch (err) {
        res.status(500).send("Lỗi Server: " + err.message);
    }
};

// GET /questions/:questionId/edit
exports.renderQuestionEdit = async (req, res) => {
    try {
        const response = await axiosInstance.get(`${apiUrl}/questions/api/questions/${req.params.questionId}`);
        const question = response.data;
        // Chuyển mảng options thành chuỗi để hiển thị trong input
        question.optionsString = question.options.join(', ');
        res.render('questions/edit', { question });
    } catch (err) {
        res.status(500).send("Lỗi Server: " + err.message);
    }
};

// GET /questions/create
exports.renderQuestionCreate = (req, res) => {
    res.render('questions/create');
};

// POST /questions/create
exports.handleCreateQuestionForm = async (req, res) => {
    try {
        const data = {
            text: req.body.text,
            options: req.body.options.split(',').map(item => item.trim()),
            correctAnswerIndex: parseInt(req.body.correctAnswerIndex)
        };
        await Question.create(data);
        res.redirect('/questions');
    } catch (err) {
        res.status(400).send("Lỗi xử lý Form: " + err.message);
    }
};

// POST /questions/:questionId/edit
exports.handleUpdateQuestionForm = async (req, res) => {
    try {
        const updateData = {
            text: req.body.text,
            correctAnswerIndex: parseInt(req.body.correctAnswerIndex)
        };
        if (req.body.options) {
            updateData.options = req.body.options.split(',').map(item => item.trim());
        }
        await Question.findByIdAndUpdate(req.params.questionId, updateData, { new: true });
        res.redirect(`/questions/${req.params.questionId}`);
    } catch (err) {
        res.status(400).send("Lỗi xử lý Form: " + err.message);
    }
};

// DELETE /questions/:questionId
exports.deleteQuestionUI = async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.questionId);
        res.redirect('/questions');
    } catch (err) {
        res.status(500).send(err.message);
    }
};

// =========================================================================
// API ENDPOINTS (Postman / Axios — Trả về JSON, dùng Mongoose trực tiếp)
// =========================================================================

exports.getAllQuestionsAPI = async (req, res) => {
    try {
        const questions = await Question.find();
        res.status(200).json(questions);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getQuestionByIdAPI = async (req, res) => {
    try {
        const question = await Question.findById(req.params.questionId);
        if (!question) return res.status(404).json({ message: 'Question not found' });
        res.status(200).json(question);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.createQuestionAPI = async (req, res) => {
    try {
        const data = { ...req.body, author: req.user._id };
        const savedQuestion = await Question.create(data);
        res.status(201).json(savedQuestion);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.updateQuestionAPI = async (req, res) => {
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

exports.deleteQuestionAPI = async (req, res) => {
    try {
        await Question.findByIdAndDelete(req.params.questionId);
        res.status(200).json({ message: "Xóa câu hỏi thành công!" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
