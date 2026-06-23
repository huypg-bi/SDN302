const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// Bản đồ các API endpoints dành riêng cho Quiz 
router.route('/')
    .get(quizController.getAllQuizzes)
    .post(quizController.createQuiz);

router.route('/:id')
    .get(quizController.getQuizById)
    .put(quizController.updateQuiz)
    .delete(quizController.deleteQuiz);

// Các tính năng nâng cao theo yêu cầu cụ thể 
router.get('/:quizId/populate', quizController.getQuizWithCapitalQuestions);
router.post('/:quizId/question', quizController.addSingleQuestionToQuiz);
router.post('/:quizId/questions', quizController.addMultipleQuestionsToQuiz);

module.exports = router;