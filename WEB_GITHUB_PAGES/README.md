# Máy ấp trứng – Web chính trên GitHub Pages

Thư mục này có thể đưa thẳng lên một repository GitHub.

## Đưa web lên GitHub Pages

1. Tạo repository mới, ví dụ `may-ap-trung`.
2. Tải toàn bộ nội dung thư mục này lên **thư mục gốc** của repository.
3. Mở **Settings → Pages**.
4. Chọn **Deploy from a branch**, nhánh `main`, thư mục `/ (root)`.
5. GitHub cung cấp địa chỉ dạng:
   `https://TEN-CUA-BAN.github.io/may-ap-trung/`
6. Kết nối điện thoại với Wi-Fi `MAYAP-xxxx`, mở `192.168.4.1/setup` và nhập địa chỉ trên vào ô **Web chính GitHub Pages**.

## Cách hoạt động

- ESP32 chỉ lưu trang cấu hình Wi-Fi ban đầu và một trang nạp rất nhỏ.
- Khi truy cập IP ESP32 trong mạng nội bộ, trang nạp lấy `app.css` và `app.js` từ GitHub Pages.
- JavaScript chạy trong trang có origin của ESP32 nên các API `/api/...` vẫn gọi trực tiếp vào ESP32, không bị lỗi mixed-content từ trang HTTPS.
- Mở trực tiếp URL GitHub Pages chỉ là chế độ xem trước/PWA. Để điều khiển máy cục bộ, mở địa chỉ IP của ESP32.

## Cảnh báo Web Push

- Trang đăng ký thông báo: `push.html`.
- Nguồn Cloudflare Worker nằm trong `cloudflare-worker/`.
- Sửa `wrangler.toml`, tạo KV và các secret VAPID trước khi deploy Worker.
- Trong web máy ấp, đặt **Địa chỉ PWA** bằng URL GitHub Pages và **Worker URL** bằng URL Cloudflare Worker.

## Cập nhật giao diện

Chỉ cần thay `app.css` hoặc `app.js` trên GitHub. Không cần nạp lại ESP32. Service Worker dùng chiến lược ưu tiên mạng và tự cập nhật cache.
