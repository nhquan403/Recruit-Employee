/**
 * Quay video demo thật trang web Việc Làm Thêm — ba vai trò: ứng viên, nhà tuyển dụng, quản
 * trị viên. Điều khiển trình duyệt thật bằng Playwright (không dựng video giả/ghép ảnh tĩnh).
 *
 * Theo yêu cầu người dùng (06/10):
 *   - Có con trỏ chuột hiển thị trong video (Playwright không vẽ cursor theo mặc định — phải
 *     tự tiêm một chấm tròn theo dõi sự kiện `mousemove` qua `context.addInitScript`, và tự di
 *     chuyển chuột từng bước nhỏ bằng `page.mouse.move(x, y, {steps})` trước mỗi lần bấm thay
 *     vì để Playwright "dịch chuyển tức thời" tới phần tử).
 *   - Gõ chữ vào form từng ký tự như người thật (`locator.pressSequentially(text, {delay})`),
 *     không dùng `.fill()` (set giá trị tức thời).
 *   - Bổ sung phần "nhà tuyển dụng" (đăng tin, quản lý tin đã đăng, quản lý ứng viên) — bản
 *     trước chỉ có ứng viên + quản trị viên, thiếu hẳn phần này.
 *
 * Mọi bước chờ trang đều có timeout ngắn + bắt lỗi riêng (không dùng waitForLoadState
 * 'networkidle' không giới hạn — bản đầu từng bị treo 30 phút vì trang có polling thông báo
 * nền chạy liên tục). Nút "Đăng nhập" nằm CẢ ở Navbar lẫn trong <form> ngay trên chính trang
 * /dang-nhap — phải chọn nút submit bằng `form button[type=submit]`. Toàn bộ logic bọc trong
 * try/finally để browser/context luôn đóng dù có lỗi.
 *
 * ID các Job tham chiếu (a0000000-0000-4000-8000-00000000000N) phải khớp đúng
 * backend/prisma/seed-demo.ts (UUID v4 hợp lệ — xem ghi chú trong seed-demo.ts).
 *
 * Yêu cầu trước khi chạy: backend (:4000) + frontend (:3000) + Postgres đã chạy, đã seed bằng
 * `cd backend && npx ts-node prisma/seed-demo.ts`.
 *
 * Chạy: npx ts-node scripts/bao_cao_hinh/quay-demo.ts
 * (ghi video .webm vào bao-cao/video-demo/; chuyển sang .mp4 bằng
 * `ffmpeg -i bao-cao/video-demo/*.webm -c:v libx264 -pix_fmt yuv420p thesis/abs/demo-user-admin.mp4`)
 */
import { chromium } from 'playwright';
import type { Page, Locator } from 'playwright';
import * as path from 'path';

// Dùng process.cwd() thay vì __dirname/import.meta.url: ts-node ở repo này đôi lúc biên dịch
// ra CommonJS, đôi lúc Node tự "reparse as ES module" (tuỳ cú pháp phát hiện được) — cả
// __dirname (không tồn tại ở ESM) và import.meta.url (bị cấm khi build ra CommonJS) đều gãy ở
// một trong hai trường hợp. process.cwd() chạy được ở cả hai và script luôn được gọi từ gốc
// repo (xem hướng dẫn "Chạy:" ở đầu file).
const GOC_REPO = path.resolve(process.cwd());
const FRONTEND_URL = 'http://localhost:3000';
const CHROME_PATH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';
const THU_MUC_VIDEO = path.join(GOC_REPO, 'bao-cao', 'video-demo');

async function cho(ms: number) {
  await new Promise((r) => setTimeout(r, ms));
}

function log(buoc: string) {
  console.log(`[${new Date().toISOString()}] ${buoc}`);
}

// Tiêm một chấm tròn theo dõi mousemove thật — chạy lại trên MỌI trang mới (kể cả sau khi điều
// hướng) nhờ addInitScript ở cấp context. Viết dưới dạng CHUỖI (không phải hàm TS) vì code này
// chạy trong ngữ cảnh trình duyệt (có `document`/`window`) còn tsconfig của repo (dùng cho
// backend Node) không khai báo lib "dom" — nếu viết thành hàm TS, biên dịch sẽ báo lỗi
// "Cannot find name 'document'". addInitScript nhận chuỗi JS thuần và tiêm thẳng, không qua
// type-check của TypeScript.
const SCRIPT_CON_TRO = `
(function () {
  function ve() {
    if (document.getElementById('__con_tro_demo__')) return;
    var el = document.createElement('div');
    el.id = '__con_tro_demo__';
    Object.assign(el.style, {
      position: 'fixed',
      zIndex: '2147483647',
      width: '22px',
      height: '22px',
      borderRadius: '50%',
      background: 'rgba(220, 38, 38, 0.55)',
      border: '2px solid white',
      pointerEvents: 'none',
      left: '0px',
      top: '0px',
      transform: 'translate(-50%, -50%)',
      boxShadow: '0 0 8px rgba(0,0,0,0.45)',
      transition: 'left 40ms linear, top 40ms linear',
    });
    document.documentElement.appendChild(el);
    window.addEventListener('mousemove', function (e) {
      el.style.left = e.clientX + 'px';
      el.style.top = e.clientY + 'px';
    });
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', ve);
  } else {
    ve();
  }
})();
`;

// Di chuyển chuột thật theo nhiều bước nhỏ tới giữa phần tử (để chấm tròn "trượt" chứ không
// dịch chuyển tức thời), rồi mới bấm — mô phỏng người dùng thật rê chuột tới nơi rồi mới click.
async function diChuyenVaBam(page: Page, loc: Locator) {
  await loc.scrollIntoViewIfNeeded();
  const box = await loc.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 18 });
    await cho(300);
  }
  await loc.click();
}

// Gõ từng ký tự như người thật thay vì set giá trị tức thời.
async function goTungChu(loc: Locator, text: string, delay = 55) {
  await loc.click();
  await loc.pressSequentially(text, { delay });
}

async function main() {
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });
  const context = await browser.newContext({
    viewport: { width: 1366, height: 820 },
    recordVideo: { dir: THU_MUC_VIDEO, size: { width: 1366, height: 820 } },
  });
  await context.addInitScript(SCRIPT_CON_TRO);
  try {
    const page = await context.newPage();
    page.setDefaultTimeout(10000);
    page.on('dialog', (dialog) => dialog.accept().catch(() => {}));

    // ===== PHẦN 1: VAI TRÒ NGƯỜI DÙNG (ỨNG VIÊN) =====
    log('1. Mở trang chủ');
    await page.goto(`${FRONTEND_URL}/`, { waitUntil: 'domcontentloaded' });
    await cho(5000);

    log('2. Cuộn xem danh sách việc làm nổi bật');
    await page.mouse.move(683, 500, { steps: 10 });
    await page.mouse.wheel(0, 350);
    await cho(2000);
    await page.mouse.wheel(0, 350);
    await cho(2000);
    await page.mouse.wheel(0, -700);
    await cho(1200);

    log('3. Gõ tìm kiếm "bán hàng"');
    await goTungChu(page.getByPlaceholder('Tìm việc làm...'), 'bán hàng');
    await cho(600);
    await diChuyenVaBam(page, page.getByRole('button', { name: 'Áp dụng' }));
    await page.waitForURL(/q=/, { timeout: 8000 }).catch(() => {});
    await cho(3500);

    log('4. Mở chi tiết tin (chưa đăng nhập)');
    await diChuyenVaBam(page, page.locator('a[href^="/viec-lam/"]').first());
    await page.waitForURL(/\/viec-lam\//, { timeout: 8000 }).catch(() => {});
    await cho(3500);

    log('5. Đăng nhập (ứng viên)');
    await diChuyenVaBam(page, page.getByRole('link', { name: 'Đăng nhập' }));
    await page.waitForURL(/\/dang-nhap/, { timeout: 8000 }).catch(() => {});
    await cho(1200);
    await goTungChu(page.getByLabel('Email', { exact: false }), 'demo.candidate1@vieclamthem.local');
    await cho(400);
    await goTungChu(page.getByLabel('Mật khẩu', { exact: false }), 'Demo@12345');
    await cho(400);
    await diChuyenVaBam(page, page.locator('form button[type="submit"]'));
    await page.waitForURL(FRONTEND_URL + '/', { timeout: 8000 }).catch(() => {});
    await cho(2500);

    log('6. Xem tin đã ứng tuyển trước đó (job 2) — thấy trạng thái');
    await page.goto(`${FRONTEND_URL}/viec-lam/a0000000-0000-4000-8000-000000000002`, {
      waitUntil: 'domcontentloaded',
    });
    await cho(3000);

    log('7. Vào tin chưa ứng tuyển và ứng tuyển thật (job 3)');
    await page.goto(`${FRONTEND_URL}/viec-lam/a0000000-0000-4000-8000-000000000003`, {
      waitUntil: 'domcontentloaded',
    });
    await cho(2500);
    await diChuyenVaBam(page, page.getByRole('button', { name: 'Ứng tuyển ngay' }));
    await cho(3500);

    log('8. Xem thông báo');
    await page.goto(`${FRONTEND_URL}/`, { waitUntil: 'domcontentloaded' });
    await cho(1500);
    await diChuyenVaBam(page, page.getByRole('button', { name: /Thông báo/ }));
    await cho(3000);
    await page.keyboard.press('Escape').catch(() => {});

    log('9. Hồ sơ cá nhân — xem đơn ứng tuyển của mình');
    await page.goto(`${FRONTEND_URL}/ho-so`, { waitUntil: 'domcontentloaded' });
    await cho(2500);
    await page.mouse.wheel(0, 500);
    await cho(1500);
    const tabPhongVan = page.getByRole('button', { name: 'Phỏng vấn' });
    if (await tabPhongVan.isVisible({ timeout: 2000 }).catch(() => false)) {
      await diChuyenVaBam(page, tabPhongVan);
      await cho(2500);
      await diChuyenVaBam(page, page.getByRole('button', { name: 'Tất cả' }));
      await cho(1500);
    }

    log('10. Đăng xuất');
    await diChuyenVaBam(page, page.locator('header button:has-text("Đăng xuất")'));
    await cho(1800);

    // ===== PHẦN 2: VAI TRÒ NHÀ TUYỂN DỤNG =====
    log('11. Đăng nhập (nhà tuyển dụng)');
    await page.goto(`${FRONTEND_URL}/dang-nhap`, { waitUntil: 'domcontentloaded' });
    await cho(1200);
    await goTungChu(page.getByLabel('Email', { exact: false }), 'demo.employer@vieclamthem.local');
    await cho(400);
    await goTungChu(page.getByLabel('Mật khẩu', { exact: false }), 'Demo@12345');
    await cho(400);
    await diChuyenVaBam(page, page.locator('form button[type="submit"]'));
    await page.waitForURL(FRONTEND_URL + '/', { timeout: 8000 }).catch(() => {});
    await cho(1800);

    log('12. Đăng tin tuyển dụng mới — điền form thật');
    await page.goto(`${FRONTEND_URL}/nha-tuyen-dung/dang-tin`, { waitUntil: 'domcontentloaded' });
    await cho(1500);
    await goTungChu(page.getByLabel('Tiêu đề công việc', { exact: false }), 'Nhân viên pha chế ca sáng');
    await cho(400);
    await goTungChu(
      page.getByLabel('Mô tả công việc', { exact: false }),
      'Pha chế đồ uống, hỗ trợ order, vệ sinh quầy pha chế vào ca sáng cuối tuần.',
      30,
    );
    await cho(400);
    await page.getByLabel('Khu vực', { exact: false }).selectOption({ label: 'Quận 3' });
    await cho(600);
    await diChuyenVaBam(page, page.getByRole('button', { name: 'Sáng' }));
    await cho(600);
    await goTungChu(page.getByLabel('Lương từ (đ/giờ)', { exact: false }), '23000');
    await cho(300);
    await goTungChu(page.getByLabel('Lương đến (đ/giờ)', { exact: false }), '30000');
    await cho(600);
    await diChuyenVaBam(page, page.getByRole('button', { name: 'Đăng tin' }));
    await page.waitForURL(/tin-cua-toi/, { timeout: 8000 }).catch(() => {});
    await cho(3500);

    log('13. Tin của tôi — danh sách tin đã đăng (gồm tin vừa tạo)');
    await page.mouse.wheel(0, 300);
    await cho(2500);

    log('14. Quản lý ứng viên của một tin đã duyệt');
    await page.goto(
      `${FRONTEND_URL}/nha-tuyen-dung/tin/a0000000-0000-4000-8000-000000000002/ung-vien`,
      { waitUntil: 'domcontentloaded' },
    );
    await cho(3000);
    const chonTrangThai = page.getByLabel('Cập nhật trạng thái', { exact: false }).first();
    if (await chonTrangThai.isVisible({ timeout: 2000 }).catch(() => false)) {
      await diChuyenVaBam(page, chonTrangThai);
      await chonTrangThai.selectOption({ label: 'Mời phỏng vấn' });
      await cho(3000);
    }

    log('15. Đăng xuất');
    await diChuyenVaBam(page, page.locator('header button:has-text("Đăng xuất")'));
    await cho(1800);

    // ===== PHẦN 3: VAI TRÒ QUẢN TRỊ VIÊN =====
    log('16. Đăng nhập admin');
    await page.goto(`${FRONTEND_URL}/dang-nhap`, { waitUntil: 'domcontentloaded' });
    await cho(1200);
    await goTungChu(page.getByLabel('Email', { exact: false }), 'admin@example.com');
    await cho(400);
    await goTungChu(page.getByLabel('Mật khẩu', { exact: false }), 'Admin@12345');
    await cho(400);
    await diChuyenVaBam(page, page.locator('form button[type="submit"]'));
    await page.waitForURL(FRONTEND_URL + '/', { timeout: 8000 }).catch(() => {});
    await cho(1800);

    log('17. Trang quản trị — tổng quan thống kê');
    await page.goto(`${FRONTEND_URL}/quan-tri`, { waitUntil: 'domcontentloaded' });
    await cho(4000);

    log('18. Duyệt các tin đang chờ (gồm tin nhà tuyển dụng vừa tạo)');
    for (let lan = 0; lan < 3; lan++) {
      const nutDuyet = page.getByRole('button', { name: 'Duyệt' }).first();
      if (!(await nutDuyet.isVisible({ timeout: 2000 }).catch(() => false))) break;
      await diChuyenVaBam(page, nutDuyet);
      await cho(2200);
    }

    log('19. Tải lại để thấy trạng thái đã cập nhật');
    await page.reload({ waitUntil: 'domcontentloaded' });
    await cho(3000);

    log('20. Cuộn xem danh sách người dùng');
    await page.mouse.wheel(0, 500);
    await cho(4000);

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
