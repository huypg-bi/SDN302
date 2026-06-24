const Question = require('../models/Question');

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
        res.status(200).json({ message: 'Question deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};
