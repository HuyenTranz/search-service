const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { authMiddleware } = require('../middleware/auth.middleware');
const { searchUser } = require('../controllers/search.controller');


router.get("/search", authMiddleware, searchUser)

module.exports = router; 