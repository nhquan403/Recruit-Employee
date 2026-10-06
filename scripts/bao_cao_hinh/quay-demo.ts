/**
 * Quay video demo thật trang web Việc Làm Thêm — vai trò ứng viên (user) rồi quản trị viên
 * (admin), điều khiển trình duyệt thật bằng Playwright (không dựng video giả/ghép ảnh tĩnh).
 *
 * Mọi bước chờ trang đều có timeout ngắn + bắt lỗi riêng (không dùng waitForLoadState
 * 'networkidle' không giới hạn — lần chạy đầu bị treo 30 phút vì trang có polling thông báo
 * nền chạy liên tục, 'networkidle' không bao giờ coi là "yên tĩnh" được). Nút "Đăng nhập" nằm
 * CẢ ở Navbar lẫn trong <form> ngay trên chính trang /dang-nhap (Navbar luôn hiển thị, kể cả
 * khi đang đứng trên trang đăng nhập) — phải chọn nút submit bằng `form button[type=submit]`,
 * không chọn theo tên "Đăng nhập" không thôi (khớp 2 phần tử, ném lỗi strict-mode). Toàn bộ
 * logic bọc trong try/finally để browser/context luôn đóng dù có lỗi.
 *
 * Nhịp độ (cho()) được kéo dài so với bản đầu để ra "một đoạn demo dài" theo đúng yêu cầu
 * người dùng, không phải một đoạn lướt nhanh ~38s.
 *
 * ID các Job tham chiếu (a0000000-0000-4000-8000-00000000000N) phải khớp đúng
 * backend/prisma/seed-demo.ts — đã đổi từ ID giả dạng cũ (00000000-...-00000000000N, version
 * nibble "0") sang UUID v4 hợp lệ vì `CreateApplicationDto.jobId` dùng `@IsUUID()`, không
 * chấp nhận ID giả — xem ghi chú trong seed-demo.ts.
 *
 * Yêu cầu trước khi chạy: backend (:4000) + frontend (:3000) + Postgres đã chạy, đã seed bằng
 * `cd backend && npx ts-node prisma/seed-demo.ts`.
 *
 * Chạy: npx ts-node scripts/bao_cao_hinh/quay-demo.ts
 * (ghi video .webm vào bao-cao/video-demo/ — tự tạo thư mục nếu chưa có; chuyển sang .mp4 bằng
 * `ffmpeg -i bao-cao/video-demo/*.webm -c:v libx264 -pix_fmt yuv420p thesis/abs/demo-user-admin.mp4`)
 */
import { chromium } from 'playwright';
import * as path from 'path';

const GOC_REPO = path.resolve(__dirname, '..', '..');
const FRONTEND_URL = 'http://localhost:3000';
const CHROME_PATH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const THU_MUC_VIDEO = path.join(GOC_REPO, 'bao-cao', 'video-demo');

async function cho(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

function log(buoc: string) {
  console.log(`[${new Date().toISOString()}] ${buoc}`);
}

async function main() {
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 820 },
    recordVideo: { dir: THU_MUC_VIDEO, size: { width: 1366, height: 820 } },
  });
  try {
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    page.on('dialog', (dialog) => dialog.accept().catch(() => {}));

    // ===== PHẦN 1: VAI TRÒ NGƯỜI DÙNG (ỨNG VIÊN) =====
    log('1. Mở trang chủ');
    await page.goto(`${FRONTEND_URL}/`, { waitUntil: 'domcontentloaded' });
    await cho(6000);

    log('2. Cuộn xem danh sách việc làm nổi bật');
    await page.mouse.wheel(0, 350);
    await cho(2500);
    await page.mouse.wheel(0, 350);
    await cho(2500);
    await page.mouse.wheel(0, -700);
    await cho(1500);

    log('3. Tìm kiếm "bán hàng"');
    await page.getByPlaceholder('Tìm việc làm...').fill('bán hàng');
    await cho(1200);
    await page.getByRole('button', { name: 'Áp dụng' }).click();
    await page.waitForURL(/q=/, { timeout: 8000 }).catch(() => {});
    await cho(4000);

    log('4. Mở chi tiết tin (chưa đăng nhập)');
    await page.locator('a[href^="/viec-lam/"]').first().click();
    await page.waitForURL(/\/viec-lam\//, { timeout: 8000 }).catch(() => {});
    await cho(4500);

    log('5. Đăng nhập (ứng viên)');
    await page.getByRole('link', { name: 'Đăng nhập' }).click();
    await page.waitForURL(/\/dang-nhap/, { timeout: 8000 }).catch(() => {});
    await cho(1500);
    await page.getByLabel('Email', { exact: false }).fill('demo.candidate1@vieclamthem.local');
    await cho(900);
    await page.getByLabel('Mật khẩu', { exact: false }).fill('Demo@12345');
    await cho(900);
    await page.locator('form button[type="submit"]').click();
    await page.waitForURL(FRONTEND_URL + '/', { timeout: 8000 }).catch(() => {});
    await cho(3000);

    log('6. Xem tin đã ứng tuyển trước đó (job 2) — thấy trạng thái');
    await page.goto(`${FRONTEND_URL}/viec-lam/a0000000-0000-4000-8000-000000000002`, {
      waitUntil: 'domcontentloaded',
    });
    await cho(3500);

    log('7. Vào tin chưa ứng tuyển và ứng tuyển thật (job 3)');
    await page.goto(`${FRONTEND_URL}/viec-lam/a0000000-0000-4000-8000-000000000003`, {
      waitUntil: 'domcontentloaded',
    });
    await cho(3000);
    await page.getByRole('button', { name: 'Ứng tuyển ngay' }).click();
    await cho(4000);

    log('8. Xem thông báo');
    await page.goto(`${FRONTEND_URL}/`, { waitUntil: 'domcontentloaded' });
    await cho(1800);
    await page
      .getByRole('button', { name: /Thông báo/ })
      .click({ timeout: 6000 })
      .catch(() => {});
    await cho(3500);
    await page.keyboard.press('Escape').catch(() => {});

    log('9. Hồ sơ cá nhân');
    await page.goto(`${FRONTEND_URL}/ho-so`, { waitUntil: 'domcontentloaded' });
    await cho(4000);

    log('10. Đăng xuất');
    await page.locator('header button:has-text("Đăng xuất")').click();
    await cho(2000);

    // ===== PHẦN 2: VAI TRÒ QUẢN TRỊ VIÊN =====
    log('11. Đăng nhập admin');
    await page.goto(`${FRONTEND_URL}/dang-nhap`, { waitUntil: 'domcontentloaded' });
    await cho(1500);
    await page.getByLabel('Email', { exact: false }).fill('admin@example.com');
    await cho(900);
    await page.getByLabel('Mật khẩu', { exact: false }).fill('Admin@12345');
    await cho(900);
    await page.locator('form button[type="submit"]').click();
    await page.waitForURL(FRONTEND_URL + '/', { timeout: 8000 }).catch(() => {});
    await cho(2000);

    log('12. Trang quản trị — tổng quan thống kê');
    await page.goto(`${FRONTEND_URL}/quan-tri`, { waitUntil: 'domcontentloaded' });
    await cho(5000);

    log('13. Duyệt tin đang chờ (nếu có)');
    const nutDuyet = page.getByRole('button', { name: 'Duyệt' }).first();
    if (await nutDuyet.isVisible({ timeout: 3000 }).catch(() => false)) {
      await nutDuyet.click();
      await cho(3000);
    }

    log('14. Tải lại để thấy trạng thái đã cập nhật');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await cho(3500);

    log('15. Cuộn xem danh sách người dùng');
    await page.mouse.wheel(0, 500);
    await cho(4500);

    log('Hoàn tất bước, chuẩn bị đóng');
    await cho(1500);
  } catch (err) {
    console.error('LỖI GIỮA CHỪNG (vẫn đóng browser để không treo):', err);
    process.exitCode = 1;
  } finally {
    await context.close();
    await browser.close();
  }

  console.log('Đã ghi video vào', THU_MUC_VIDEO);
}

main()
  .catch((err) => {
    console.error('LỖI:', err);
    process.exitCode = 1;
  })
  .finally(() => process.exit(process.exitCode ?? 0));
