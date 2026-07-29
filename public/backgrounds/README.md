# Ảnh nền tuỳ chọn

Đặt ảnh nền của bạn vào thư mục con theo **định dạng**:

- `short/` — ảnh **dọc 9:16** (`1080×1920`) cho Short/Reels
- `landscape/` — ảnh **ngang 16:9** (`1920×1080`) cho YouTube ngang

Ảnh để thẳng trong thư mục này (không trong `short/` hay `landscape/`) được dùng làm
**dự phòng** khi thư mục định dạng tương ứng trống.

- Mỗi lần chạy `npm run generate`, công cụ **chọn/xáo trộn ngẫu nhiên** ảnh của định
  dạng đang chọn. Thư mục trống → dùng nền pop-art mặc định (vẽ bằng code).
- Bạn có thể **gắn sẵn logo** vào ảnh nền (công cụ không tự chèn logo).

Điều khiển qua cờ: `--bg auto` (mặc định) | `--bg none` | `--bg "a.jpg,b.png"`.
