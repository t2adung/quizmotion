# Ảnh nền tuỳ chọn

Đặt ảnh nền của bạn vào thư mục này (`.jpg`, `.png`, `.webp`, `.svg`…).

- Mỗi lần chạy `npm run generate`, công cụ sẽ **chọn/xáo trộn ngẫu nhiên** các ảnh ở đây.
- Với video ngang nhiều câu, mỗi câu (và intro/outro) lấy một ảnh theo thứ tự đã xáo.
- Nếu thư mục trống → dùng nền pop-art mặc định (vẽ bằng code).
- Kích thước khuyến nghị: Short/Reels `1080×1920`, YouTube ngang `1920×1080`.
- Bạn có thể **gắn sẵn logo** vào ảnh nền (công cụ không tự chèn logo nữa).

Điều khiển qua cờ:
- `--bg auto`  (mặc định) dùng tất cả ảnh, ngẫu nhiên
- `--bg none`  bỏ qua ảnh, dùng nền pop-art
- `--bg "a.jpg,b.png"`  chỉ dùng các ảnh chỉ định

`sample-background.svg` chỉ là ảnh mẫu — cứ xoá đi khi bạn thêm ảnh của mình.
