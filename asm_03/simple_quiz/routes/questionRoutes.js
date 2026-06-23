const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { verifyUser, verifyAuthor } = require('../authenticate');

// ==========================================
// ROUTE GIAO DIỆN (Trả về HTML cho Trình Duyệt)
// ==========================================
router.get('/', questionController.renderQuestionList);               // Trang danh sách
router.get('/create', questionController.renderQuestionCreate);       // Trang form tạo mới
router.get('/:questionId/edit', questionController.renderQuestionEdit); // Trang form chỉnh sửa
router.get('/:questionId', questionController.renderQuestionDetail);  // Trang chi tiết

// Xử lý submit từ Form UI
router.post('/create', questionController.handleCreateQuestionForm);
router.post('/:questionId/edit', questionController.handleUpdateQuestionForm);
router.delete('/:questionId', questionController.deleteQuestionUI);

// ==========================================
// ROUTE API THUẦN (Trả về JSON cho Postman / Axios)
// ==========================================

// Task 4: GET — ai cũng xem được
router.get('/api/questions', questionController.getAllQuestionsAPI);
router.get('/api/questions/:questionId', questionController.getQuestionByIdAPI);

// Task 4: POST — phải đăng nhập, author tự động được gán từ req.user
router.post('/api/questions', verifyUser, questionController.createQuestionAPI);

// Task 4: PUT, DELETE — phải là chính tác giả của câu hỏi
router.put('/api/questions/:questionId', verifyUser, verifyAuthor, questionController.updateQuestionAPI);
router.delete('/api/questions/:questionId', verifyUser, verifyAuthor, questionController.deleteQuestionAPI);

module.exports = router;