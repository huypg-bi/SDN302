const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { verifyUser, verifyAdmin } = require('../authenticate');

router.get('/api/quizzes', quizController.getAllQuizzesAPI);
router.get('/api/quizzes/:id', quizController.getQuizByIdAPI);
router.post('/api/quizzes', verifyUser, verifyAdmin, quizController.createQuizAPI);
router.put('/api/quizzes/:id', verifyUser, verifyAdmin, quizController.updateQuizAPI);
router.delete('/api/quizzes/:id', verifyUser, verifyAdmin, quizController.deleteQuizAPI);

router.get('/api/quizzes/:quizId/populate', quizController.getQuizWithCapitalQuestions);
router.post('/api/quizzes/:quizId/question', verifyUser, verifyAdmin, quizController.addSingleQuestionToQuiz);
router.post('/api/quizzes/:quizId/questions', verifyUser, verifyAdmin, quizController.addMultipleQuestionsToQuiz);

module.exports = router;
