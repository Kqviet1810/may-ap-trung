# Máy ấp trứng V7 – Web chung GitHub Pages

Web vận hành chính luôn dùng địa chỉ:

`https://kqviet1810.github.io/may-ap-trung/`

ESP32 không còn phục vụ giao diện vận hành chính. ESP32 chỉ giữ trang cấu hình ban đầu và chủ động đồng bộ dữ liệu/lệnh với Cloudflare Worker qua HTTPS.

## Kiến trúc

```text
Điện thoại mở GitHub Pages
        ↕ HTTPS
Cloudflare Worker + Durable Object
        ↕ HTTPS do ESP32 chủ động gửi
ESP32-S3
```

Nhờ vậy web chung vẫn dùng được ngoài mạng Wi-Fi của máy. Khi đóng web, chuyển tab, mất điện thoại hoặc Worker tạm thời không phản hồi, ESP32 vẫn vận hành bằng cấu hình đã lưu trong NVS. Chỉ chuyển động cơ đang được **giữ thủ công** mới tự dừng vì an toàn.

## A. Đưa web lên GitHub

1. Xóa hoặc ghi đè các file cũ trong repository `may-ap-trung`.
2. Upload toàn bộ nội dung thư mục này vào thư mục gốc repository.
3. Giữ nguyên file `.nojekyll`.
4. GitHub: **Settings → Pages → Deploy from a branch → main → /(root)**.
5. Chờ GitHub triển khai xong rồi mở địa chỉ web chung ở trên.

Trước khi dùng, phải deploy Worker và sửa `config.js`:

```js
workerUrl: 'https://TEN-WORKER-CUA-BAN.workers.dev'
```

## B. Deploy Cloudflare Worker

Mở terminal tại thư mục `cloudflare-worker`:

```bash
npm install
npx web-push generate-vapid-keys
```

Đặt các secret:

```bash
npx wrangler secret put ENROLLMENT_KEY
npx wrangler secret put VAPID_SUBJECT
npx wrangler secret put VAPID_PUBLIC_KEY
npx wrangler secret put VAPID_PRIVATE_KEY
```

Giá trị gợi ý:

- `ENROLLMENT_KEY`: mã cài đặt riêng do người quản trị tự đặt.
- `VAPID_SUBJECT`: dạng `mailto:email-cua-ban@example.com`.
- Hai khóa VAPID: lấy từ lệnh `generate-vapid-keys`.

Sau đó:

```bash
npx wrangler deploy
```

Sao chép URL Worker được cấp và điền vào `config.js`, sau đó commit lại GitHub.

## C. Cấu hình ESP32 lần đầu

1. Nạp file `.ino` V7.
2. Kết nối Wi-Fi `MAYAP-xxxx`, mật khẩu mặc định `mayap1234`.
3. Mở `http://192.168.4.1/setup`.
4. Nhập Wi-Fi 2.4 GHz, URL Worker, `ENROLLMENT_KEY` và khóa ghép nối thiết bị.
5. Nhấn kết nối. ESP32 khởi động lại, đăng ký với Worker và bắt đầu đồng bộ.

Sau khi ESP32 có Wi-Fi, mở địa chỉ IP của ESP32 một lần. ESP32 sẽ chuyển sang web GitHub chung bằng URL fragment chứa ID/khóa ghép nối; web lưu thông tin trên điện thoại rồi tự xóa fragment khỏi thanh địa chỉ.

## D. Kiểm tra kết nối

Serial Monitor `115200 baud` phải có các dòng tương tự:

```text
[CLOUD] Da dang ky Worker cho MAP-A1B2
[STATUS] ... | Cloud=OK | CloudHTTP=200
```

Web sẽ hiển thị **Trực tuyến** khi Worker vừa nhận dữ liệu từ ESP32. Khi mất kết nối, web hiển thị **Dữ liệu gần nhất**, còn máy vẫn chạy bằng cấu hình đã lưu.

## E. Thanh trạng thái trên điện thoại

Thanh trạng thái máy được ghim dưới header. JavaScript đo chiều cao header thực tế nên thanh không còn bị che một nửa khi màn hình hẹp hoặc chữ xuống dòng.
