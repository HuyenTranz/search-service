const User = require("../models/user.model");

const searchUser = async (req, res) => {
    try {
        //search?text=
        const searchText = req.query.text?.trim();

        if (!searchText) {
            return res.status(200).json({
                message: "Vui lòng nhập người dùng cần tìm kiếm!",
                users: [],
                isEmpty: true,
                status: false
            });
        }

        // Nếu chỉ nhập toàn ký tự đặc biệt → từ chối tìm kiếm
        if (/^[^a-zA-Z0-9]+$/.test(searchText)) {
            return res.status(200).json({
                message: "Không hỗ trợ tìm kiếm chỉ bằng ký tự đặc biệt!",
                users: [],
                isEmpty: true,
                status: false
            });
        }

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
        console.log(error)
        return res.status(500).json({
            status: false,
            message: "Lỗi máy chủ"
        });
    }
}

module.exports = { searchUser }