const User = require("../models/user.model");

const searchUser = async (req, res) => {
    try {
        const searchText = req.query.text?.trim();
        const page = parseInt(req.query.page) || 1; // Mặc định là trang 1
        const limit = parseInt(req.query.limit) || 8; // Mặc định là 8 item mỗi trang
        const skip = (page - 1) * limit; // Tính toán số lượng item cần bỏ qua

        // Đếm tổng số người dùng phù hợp
        const totalUsers = await User.countDocuments({
            $or: [
                { username: new RegExp(searchText, 'i') },
                { fullname: new RegExp(searchText, 'i') },
            ]
        });

        // Tính tổng số trang
        const totalPages = Math.ceil(totalUsers / limit);

        // Lấy danh sách người dùng theo phân trang
        const users = await User.find({
            $or: [
                { username: new RegExp(searchText, 'i') },
                { fullname: new RegExp(searchText, 'i') },
            ]
        })
            .skip(skip) // Bỏ qua các item của các trang trước
            .limit(limit); // Giới hạn số lượng item trả về

        if (!users || users.length === 0) {
            return res.status(200).json({
                message: "Không tìm thấy người dùng!",
                users: [],
                isEmpty: true,
                status: false,
                totalUsers,
                totalPages
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
            status: true,
            totalUsers,
            totalPages
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            status: false,
            message: "Lỗi máy chủ"
        });
    }
};

module.exports = { searchUser };