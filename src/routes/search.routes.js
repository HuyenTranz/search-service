const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authMiddleware } = require('../middleware/auth.middleware');
const { searchUser } = require('../controllers/search.controller');
const { createValidationMiddleware } = require('../middleware/validation/validateRequest');
const { searchUserValidationRules } = require('../middleware/validation/search.validation');

router.get("/search", authMiddleware, createValidationMiddleware(searchUserValidationRules), searchUser);

module.exports = router; 