const Quiz = require('../models/Quiz');
const Question = require('../models/Question');

// GET /quizzes - Lấy tất cả bộ đề kèm chi tiết câu hỏi (Sử dụng Populate) 
exports.getAllQuizzes = async (req, res) => {
    try {
        const quizzes = await Quiz.find().populate('questions');
        res.status(200).json(quizzes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /quizzes/:id
exports.getQuizById = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.id)
            .populate('questions');

        if (!quiz) {
            return res.status(404).json({
                message: 'Quiz not found'
            });
        }

        res.status(200).json(quiz);
    } catch (err) {
        res.status(500).json({
            error: err.message
        });
    }
};

// PUT /quizzes/:id
exports.updateQuiz = async (req, res) => {
    try {
        const updatedQuiz = await Quiz.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        res.status(200).json(updatedQuiz);
    } catch (err) {
        res.status(400).json({
            error: err.message
        });
    }
};

// POST /quizzes - Tạo mới một bộ đề trống 
exports.createQuiz = async (req, res) => {
    try {
        const newQuiz = new Quiz(req.body);
        const savedQuiz = await newQuiz.save();
        // Trả về đúng định dạng text/chuỗi như ảnh chụp số 2 của đề bài 
        // res.status(200).send(`Added the quiz with id: ${savedQuiz._id}`);
        res.status(200).json(savedQuiz)
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// DELETE /quizzes/:id - Xóa bộ đề
exports.deleteQuiz = async (req, res) => {
    try {
        await Quiz.findByIdAndDelete(req.params.id);

        await Question.deleteMany({
            _id: { $in: Quiz.questions }
        });

        res.status(200).json({ message: "Quiz delete successfully." });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// GET /quizzes/:quizId/populate - Tìm câu hỏi trong đề chứa từ "capital" 
exports.getQuizWithCapitalQuestions = async (req, res) => {
    try {
        const quiz = await Quiz.findById(req.params.quizId).populate({
            path: 'questions',
            match: { text: { $regex: "capital", $options: 'i' } }// Lọc nâng cao theo từ khoá 
        });

        if (!quiz) {
            return res.status(404).json({ message: 'Quiz not found' });
        }

        res.status(200).json(quiz);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

// POST /quizzes/:quizId/question - Thêm 1 câu hỏi vào đề cụ thể 
exports.addSingleQuestionToQuiz = async (req, res) => {
    try {
        // 1. Tạo mới câu hỏi trong Database
        const newQuestion = await Question.create(req.body);

        // 2. Đẩy ID câu hỏi vừa tạo vào mảng questions của Quiz tương ứng
        await Quiz.findByIdAndUpdate(
            req.params.quizId,
            { $push: { questions: newQuestion._id } }
        );

        res.status(201).json(newQuestion); // Trả về object câu hỏi vừa tạo giống ảnh 5 
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};

// POST /quizzes/:quizId/questions - Thêm nhiều câu hỏi cùng lúc vào đề 
exports.addMultipleQuestionsToQuiz = async (req, res) => {
    try {
        const questionsArray = req.body; // Client gửi lên một mảng các câu hỏi

        // 1. Lưu hàng loạt câu hỏi vào database cùng lúc
        const savedQuestions = await Question.insertMany(questionsArray);

        // 2. Lấy ra danh sách các ID của câu hỏi vừa lưu
        const questionIds = savedQuestions.map(q => q._id);

        // 3. Đẩy toàn bộ ID này vào Quiz
        await Quiz.findByIdAndUpdate(
            req.params.quizId,
            { $push: { questions: { $each: questionIds } } }
        );

        // Trả về câu thông báo thành công
        res.status(200).json({ message: "Questions added successfully." });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
};
