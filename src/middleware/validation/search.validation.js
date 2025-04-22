const { query } = require('express-validator');

const searchUserValidationRules = [
    query('text')
        .trim()
        .notEmpty()
        .withMessage('Vui lòng nhập người dùng cần tìm kiếm!')
        .custom(value => {
            if (/^[^a-zA-Z0-9]+$/.test(value)) {
                throw new Error('Không hỗ trợ tìm kiếm chỉ bằng ký tự đặc biệt!');
            }
            return true;
        }),
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Số trang phải là số nguyên lớn hơn hoặc bằng 1!'),
    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Giới hạn mỗi trang phải là số nguyên từ 1 đến 100!')
];

module.exports = { searchUserValidationRules };