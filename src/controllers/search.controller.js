const User = require("../models/user.model");

const searchUser = async (req, res) => {
    try {
        const searchText = req.query.text?.trim();

        const users = await User.find({
            $or: [
                { username: new RegExp(searchText, 'i') },
                { fullname: new RegExp(searchText, 'i') },
            ]
        })
            .limit(20);

        if (!users || users.length === 0) {
            return res.status(200).json({
                message: "Không tìm thấy người dùng!",
                users: [],
                isEmpty: true,
                status: false
            });
        }

        const formattedUsers = users.map(user => ({
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            avatar: user.avatar,
            bio: user.bio,
            link: user.link
        }));

        return res.status(200).json({
            message: "Tìm kiếm thành công",
            users: formattedUsers,
            isEmpty: false,
            status: true
        });

    } catch (error) {
        console.log(error); // Nhớ thay bằng logger.error sau này
        return res.status(500).json({
            status: false,
            message: "Lỗi máy chủ"
        });
    }
};

module.exports = { searchUser };