const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { verifyUser, verifyAuthor } = require('../authenticate');

router.get('/api/questions', questionController.getAllQuestionsAPI);
router.get('/api/questions/:questionId', questionController.getQuestionByIdAPI);
router.post('/api/questions', verifyUser, questionController.createQuestionAPI);
router.put('/api/questions/:questionId', verifyUser, verifyAuthor, questionController.updateQuestionAPI);
router.delete('/api/questions/:questionId', verifyUser, verifyAuthor, questionController.deleteQuestionAPI);

module.exports = router;
