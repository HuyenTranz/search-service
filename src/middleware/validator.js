const { validationResult } = require('express-validator');

const validateRequest = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      errors: errors.array(),
    });
  }
  next();
};

const createValidationMiddleware = (validationRules) => {
  return [...validationRules, validateRequest];
};

module.exports = {
  validateRequest,
  createValidationMiddleware,
}; 