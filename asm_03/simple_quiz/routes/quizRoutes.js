const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { verifyUser, verifyAdmin } = require('../authenticate');

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

// Task 2: GET — ai cũng xem được
router.get('/api/quizzes', quizController.getAllQuizzesAPI);
router.get('/api/quizzes/:id', quizController.getQuizByIdAPI);

// Task 2: POST, PUT, DELETE — chỉ Admin mới được thực hiện
router.post('/api/quizzes', verifyUser, verifyAdmin, quizController.createQuizAPI);
router.put('/api/quizzes/:id', verifyUser, verifyAdmin, quizController.updateQuizAPI);
router.delete('/api/quizzes/:id', verifyUser, verifyAdmin, quizController.deleteQuizAPI);

// Các API tính năng nâng cao
router.get('/api/quizzes/:quizId/populate', quizController.getQuizWithCapitalQuestions);
router.post('/api/quizzes/:quizId/question', verifyUser, verifyAdmin, quizController.addSingleQuestionToQuiz);
router.post('/api/quizzes/:quizId/questions', verifyUser, verifyAdmin, quizController.addMultipleQuestionsToQuiz);

module.exports = router;