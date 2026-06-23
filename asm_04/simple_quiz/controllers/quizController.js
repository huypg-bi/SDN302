const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

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
        const updatedQuiz = await Quiz.findByIdAndUpdate(req.params.id, req.body, { returnDocument: 'after' });
        res.status(200).json(updatedQuiz);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

exports.deleteQuizAPI = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id);
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
        await Question.deleteMany({ _id: { $in: quiz.questions } });
        await Quiz.findByIdAndDelete(req.params.id);
        res.status(200).json({ message: 'Quiz deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

exports.getQuizWithCapitalQuestions = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId).populate({
            path: 'questions',
            match: { text: { $regex: 'capital', $options: 'i' } },
        });
        if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
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
        const questionIds = savedQuestions.map((q) => q._id);
        await Quiz.findByIdAndUpdate(req.params.quizId, { $push: { questions: { $each: questionIds } } });
        res.status(200).json({ message: 'Questions added successfully' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
