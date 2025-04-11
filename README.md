# Search Service
Dịch vụ này cung cấp API để tìm kiếm người dùng theo username hoặc họ tên (fullname).

# Tính năng
- Tìm kiếm người dùng theo username hoặc fullname (không phân biệt chữ hoa/thường)
- Trả về danh sách người dùng phù hợp (giới hạn tối đa 20 kết quả)
- Từ chối nếu không nhập từ khóa tìm kiếm
- Từ chối nếu chuỗi tìm kiếm chỉ chứa ký tự đặc biệt

# Chạy ở môi trường phát triển
npm run dev

# API Endpoint
GET /api/search?text=...

# Tham số truy vấn:
text (string): Một phần username hoặc fullname cần tìm kiếm.

# Hành vi:
- Trả về danh sách người dùng khớp với chuỗi tìm kiếm.
- Nếu text rỗng → trả về thông báo yêu cầu nhập từ khóa.
- Nếu chỉ nhập ký tự đặc biệt → từ chối tìm kiếm.
- Nếu không tìm thấy người dùng → trả về danh sách rỗng.
- Nếu có lỗi máy chủ → trả về thông báo lỗi và status code phù hợp.

# Ví dụ:
Phản hồi thành công: 
```json
{
  "message": "Tìm kiếm thành công",
  "users": [
    {
      "_id": "123",
      "username": "johndoe",
      "fullname": "John Doe",
      "avatar": "link_anh_dai_dien",
      "bio": "Kỹ sư phần mềm",
      "link": "https://profile.link"
    }
  ],
  "isEmpty": false,
  "status": true
}
```

Các phản hồi lỗi có định dạng như sau:
```json
{
    "message": "Không hỗ trợ tìm kiếm chỉ bằng ký tự đặc biệt!",
    "users": [],
    "isEmpty": true,
    "status": false
}
```
