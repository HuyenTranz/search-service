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
];

module.exports = { searchUserValidationRules };