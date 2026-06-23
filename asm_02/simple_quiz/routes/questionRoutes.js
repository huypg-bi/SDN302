const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

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
router.get('/api/questions', questionController.getAllQuestionsAPI);
router.get('/api/questions/:questionId', questionController.getQuestionByIdAPI);
router.post('/api/questions', questionController.createQuestionAPI);
router.put('/api/questions/:questionId', questionController.updateQuestionAPI);
router.delete('/api/questions/:questionId', questionController.deleteQuestionAPI);

module.exports = router;