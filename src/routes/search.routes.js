const express = require('express');
const router = express.Router();
const { authMiddleware } = require('../middleware/auth.middleware');
const { searchUser } = require('../controllers/search.controller');
const { searchUserValidationRules } = require('../middleware/validation/search.validation');
const { createValidationMiddleware } = require('../middleware/validation/validateRequest');

// Route tìm kiếm người dùng với middleware validation được tái sử dụng
router.get(
    "/search",
    authMiddleware,
    createValidationMiddleware(searchUserValidationRules),
    searchUser
);

module.exports = router;