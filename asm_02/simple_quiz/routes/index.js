const express = require('express');
const router = express.Router();

// Trang chủ — dùng EJS (specific page theo yêu cầu đề bài)
router.get('/', (req, res) => {
    res.render('partials/index.ejs');
});

module.exports = router;
