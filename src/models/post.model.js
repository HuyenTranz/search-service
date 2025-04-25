const mongoose = require("mongoose");

// Định nghĩa UserTag Schema
const UserTagSchema = new mongoose.Schema({
    id: { type: String, required: true },
    name: { type: String, required: true },
});

// Định nghĩa PollOption Schema
const PollOptionSchema = new mongoose.Schema({
    content: { type: String, required: true },
    vote_count: { type: Number, default: 0 },
    voters: [{ type: String }], // Danh sách ID người đã vote
});

// Định nghĩa Poll Schema
const PollSchema = new mongoose.Schema({
    end_at: { type: Date, required: true },
    status_poll: { type: String, enum: ["active", "closed"], default: "active" },
    poll_options: [PollOptionSchema],
});

// Định nghĩa Post Schema
const PostSchema = new mongoose.Schema(
    {
        creator_id: { type: String, required: true }, // ID người tạo bài viết
        content: { type: String, required: true }, // Nội dung bài viết
        visibility: { type: String, enum: ["public", "private"], default: "public" }, // Quyền xem bài viết
        hashtags: [{ type: String }], // Danh sách hashtag
        user_tags: [UserTagSchema], // Danh sách người được tag
        poll: PollSchema, // Thăm dò ý kiến (nếu có)
        createdAt: { type: Date, default: Date.now }, // Thời gian tạo
        updatedAt: { type: Date, default: Date.now }, // Thời gian cập nhật
    },
    { timestamps: true }
);

// Tạo chỉ mục tìm kiếm
PostSchema.index({ content: "text", hashtags: 1 });

// Xuất Post Model
module.exports = mongoose.model("Post", PostSchema);