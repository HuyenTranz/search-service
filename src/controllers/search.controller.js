const User = require("../models/user.model");
const Post = require("../models/post.model");

const searchUser = async (req, res) => {
    try {
        const { text, page, limit } = req.query;
        if (!text) {
            return res.status(400).json({
                status: false,
                message: "Thiếu từ khóa tìm kiếm"
            });
        }

        const searchText = text.trim();
        const currentPage = parseInt(page) || 1;
        const itemsPerPage = parseInt(limit) || 8;
        const skip = (currentPage - 1) * itemsPerPage;

        let users = [];
        let totalUsers = 0;
        let posts = [];
        let totalPosts = 0;

        if (searchText === "#") {
            return res.status(400).json({
                status: false,
                message: "Từ khóa tìm kiếm không hợp lệ",
                data: {
                    users: {
                        items: [],

                    },
                    posts: {
                        items: []
                    }
                },
            });
        }

        // Nếu từ khóa bắt đầu bằng # → ưu tiên tìm theo hashtag
        if (searchText.startsWith('#')) {
            // Tìm user theo username và fullname (bao gồm cả #)
            totalUsers = await User.countDocuments({
                $or: [
                    { username: new RegExp(searchText, 'i') },
                    { fullname: new RegExp(searchText, 'i') }
                ]
            });

            users = await User.find({
                $or: [
                    { username: new RegExp(searchText, 'i') },
                    { fullname: new RegExp(searchText, 'i') }
                ]
            })
                .skip(skip)
                .limit(itemsPerPage);

            // Tìm post chỉ theo hashtag
            totalPosts = await Post.countDocuments({
                hashtags: searchText
            });

            // Chỉ tìm bài viết có hashtag đúng y như từ khóa.
            posts = await Post.find({
                hashtags: searchText
            })
                .skip(skip)
                .limit(itemsPerPage)
                .lean();
        } else { // Nếu KHÔNG bắt đầu bằng # → tìm theo cả content và hashtag
            // Tìm user theo username và fullname
            totalUsers = await User.countDocuments({
                $or: [
                    { username: new RegExp(searchText, 'i') },
                    { fullname: new RegExp(searchText, 'i') }
                ]
            });

            users = await User.find({
                $or: [
                    { username: new RegExp(searchText, 'i') },
                    { fullname: new RegExp(searchText, 'i') }
                ]
            })
                .skip(skip)
                .limit(itemsPerPage);


            // Tìm post theo cả content và hashtags
            totalPosts = await Post.countDocuments({
                $or: [
                    { content: new RegExp(searchText, 'i') },
                    { hashtags: new RegExp(searchText, 'i') }
                ]
            });

            posts = await Post.find({
                $or: [
                    { content: new RegExp(searchText, 'i') },
                    { hashtags: new RegExp(searchText, 'i') }
                ]
            })
                .skip(skip)
                .limit(itemsPerPage)
                .lean();
        }

        // Gắn thông tin người tạo bài viết (creator)
        if (posts.length > 0) {
            const creatorIds = posts.map(post => post.creator_id);
            const creators = await User.find(
                { _id: { $in: creatorIds } },
                { _id: 1, username: 1, fullname: 1, avatar: 1 }
            ).lean();

            const creatorMap = creators.reduce((map, creator) => {
                map[creator._id.toString()] = creator;
                return map;
            }, {});

            posts = posts.map(post => ({
                ...post,
                creator: creatorMap[post.creator_id.toString()]
            }));
        }

        // Định dạng lại dữ liệu user trả về
        const formattedUsers = users.map(user => ({
            _id: user._id,
            username: user.username,
            fullname: user.fullname,
            avatar: user.avatar,
            bio: user.bio,
            link: user.link
        }));

        // Tính tổng số trang
        const totalPages = Math.max(
            Math.ceil(totalUsers / itemsPerPage),
            Math.ceil(totalPosts / itemsPerPage)
        );

        console.log(posts)

        return res.status(200).json({
            type: "search",
            message: "Tìm kiếm thành công",
            data: {
                users: {
                    items: formattedUsers,
                    total: totalUsers,
                    isEmpty: users.length === 0
                },
                posts: {
                    items: posts,
                    total: totalPosts,
                    isEmpty: posts.length === 0
                }
            },
            status: true,
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