const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { searchUser } = require('../controllers/search.controller');
const { searchUserValidationRules } = require('../middleware/validation/search.validation');
const { validationResult } = require('express-validator');

// Middleware để kiểm tra kết quả validation
const validateRequest = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    next();
};

// Route tìm kiếm người dùng
router.get(
    "/search",
    authMiddleware, // Middleware xác thực
    searchUserValidationRules, // Các quy tắc validation
    validateRequest, // Kiểm tra kết quả validation
    searchUser // Controller xử lý logic tìm kiếm
);

module.exports = router;