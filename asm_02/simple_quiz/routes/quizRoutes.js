const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');

// ==========================================
// ROUTE GIAO DIỆN (Web Browser hiển thị)
// ==========================================
router.get('/', quizController.renderQuizList);               // Hiển thị danh sách đề
router.get('/create', quizController.renderQuizCreate);       // Hiển thị form tạo mới
router.get('/:id/details', quizController.renderQuizById);    // Hiển thị chi tiết đề
router.get('/:id/edit', quizController.renderQuizEdit);       // Hiển thị form sửa đề
router.delete('/:id', quizController.deleteQuizUI);           // Xóa đề
router.post('/:id/edit', quizController.handleUpdateQuizForm); // Chỉnh sửa đề

router.post('/create', quizController.handleCreateQuizForm); // Form HTML submit lên đây

// ==========================================
// ROUTE API thuần (Dành cho Postman / Axios)
// ==========================================
router.get('/api/quizzes', quizController.getAllQuizzesAPI);
router.post('/api/quizzes', quizController.createQuizAPI);
router.put('/api/quizzes/:id', quizController.updateQuizAPI);
router.delete('/api/quizzes/:id', quizController.deleteQuizAPI);
router.get('/api/quizzes/:id', quizController.getQuizByIdAPI); // Hiển thị tất cả danh sách đề

// Các API tính năng nâng cao
router.get('/api/quizzes/:quizId/populate', quizController.getQuizWithCapitalQuestions);
router.post('/api/quizzes/:quizId/question', quizController.addSingleQuestionToQuiz);
router.post('/api/quizzes/:quizId/questions', quizController.addMultipleQuestionsToQuiz);

module.exports = router;