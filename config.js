/*
  Cấu hình chung của web GitHub Pages.
  Chỉ cần sửa workerUrl sau khi deploy Cloudflare Worker.
*/
window.MAYAP_CONFIG = Object.freeze({
  webUrl: 'https://kqviet1810.github.io/may-ap-trung/',
  workerUrl: 'https://mayap-cloud-bridge.vietk-mayaptrung.workers.dev',
  pollMs: 2500
});
