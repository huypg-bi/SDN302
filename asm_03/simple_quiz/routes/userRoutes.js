const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { verifyUser, verifyAdmin } = require('../authenticate');

// Đăng ký và đăng nhập — không cần token
router.post('/signup', userController.registerUser);
router.post('/login', userController.loginUser);

// Task 3: Chỉ Admin mới xem được danh sách users
router.get('/', verifyUser, verifyAdmin, userController.getAllUsers);

module.exports = router;