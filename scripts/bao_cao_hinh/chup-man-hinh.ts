/**
 * Chụp screenshot thật từ ứng dụng Việc Làm Thêm đang chạy (backend :4000, frontend :3000)
 * cho báo cáo đồ án — Phase 3 của plans/260927-0624-bao-cao-do-an/plan.md.
 *
 * Đăng nhập bằng cách gọi thẳng API /auth/login lấy access token rồi set vào localStorage
 * qua page.addInitScript, KHÔNG click qua form đăng nhập mỗi lần — nhanh và ổn định hơn
 * (đúng chỉ dẫn ở phase-03-hinh-anh.md).
 *
 * Chạy: npx ts-node scripts/bao_cao_hinh/chup-man-hinh.ts
 */
import { chromium } from 'playwright';
import * as path from 'path';
import * as fs from 'fs';

// __dirname không có sẵn khi file này chạy dưới dạng ES module (tuỳ cách ts-node/tsconfig của
// máy chạy quyết định) — suy ra thư mục gốc repo bằng process.cwd() thay vì hard-code, với
// điều kiện chạy đúng lệnh trong README (npx ts-node từ thư mục gốc repo).
const GOC_REPO = process.cwd();
const THU_MUC_ANH = path.join(GOC_REPO, 'docs', 'images', 'bao-cao');
const FRONTEND_URL = 'http://localhost:3000';
const BACKEND_URL = 'http://localhost:4000';
const CHROME_PATH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome';

type TaiKhoan = { email: string; password: string };

const TAI_KHOAN: Record<string, TaiKhoan> = {
  candidate: { email: 'demo.candidate1@vieclamthem.local', password: 'Demo@12345' },
  employer: { email: 'demo.employer@vieclamthem.local', password: 'Demo@12345' },
  admin: { email: 'admin@example.com', password: 'Admin@12345' },
};

async function dangNhapLayToken(email: string, password: string): Promise<{ accessToken: string; user: any }> {
  const res = await fetch(`${BACKEND_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  if (!res.ok) {
    throw new Error(`Đăng nhập thất bại (${email}): ${res.status} ${await res.text()}`);
  }
  return (await res.json()) as { accessToken: string; user: any };
}

interface ManHinh {
  file: string;
  route: string;
  vaiTro: keyof typeof TAI_KHOAN | null;
  choXuLy?: (page: import('playwright').Page) => Promise<void>;
}

// Route thật lấy trực tiếp từ cây thư mục frontend/src/app (đã ls trước khi viết, không đoán
// theo quy ước tiếng Anh thường gặp — app này định tuyến bằng tiếng Việt không dấu-gạch nối).
const DANH_SACH_MAN_HINH: ManHinh[] = [
  { file: 'hinh-1-1-trang-chu.png', route: '/', vaiTro: null },
  { file: 'hinh-1-2-tim-kiem-loc.png', route: '/viec-lam', vaiTro: null },
  {
    file: 'hinh-1-3-chi-tiet-tin.png',
    route: '/viec-lam/00000000-0000-0000-0000-000000000002',
    vaiTro: null,
  },
  {
    file: 'hinh-3-4-thong-bao.png',
    route: '/',
    vaiTro: 'candidate',
    choXuLy: async (page) => {
      await page.getByRole('button', { name: /Thông báo/ }).click();
      await page.waitForTimeout(400);
    },
  },
  { file: 'hinh-3-5-ho-so-ung-vien.png', route: '/ho-so', vaiTro: 'candidate' },
  { file: 'hinh-3-1-dang-tin.png', route: '/nha-tuyen-dung/dang-tin', vaiTro: 'employer' },
  { file: 'hinh-3-2-quan-ly-ung-vien.png', route: '/nha-tuyen-dung/tin/00000000-0000-0000-0000-000000000002/ung-vien', vaiTro: 'employer' },
  { file: 'hinh-3-3-duyet-tin-admin.png', route: '/quan-tri', vaiTro: 'admin' },
];

async function main() {
  fs.mkdirSync(THU_MUC_ANH, { recursive: true });

  const tokenTheoVaiTro: Record<string, { accessToken: string; user: any }> = {};
  for (const [ten, tk] of Object.entries(TAI_KHOAN)) {
    tokenTheoVaiTro[ten] = await dangNhapLayToken(tk.email, tk.password);
    console.log(`Đăng nhập OK: ${ten} (${tk.email})`);
  }

  // Trước tiên cần biết đúng key mà frontend đọc trong localStorage — dò trong mã nguồn.
  const browser = await chromium.launch({ executablePath: CHROME_PATH, headless: true });

  for (const manHinh of DANH_SACH_MAN_HINH) {
    const context = await browser.newContext({ viewport: { width: 1280, height: 900 } });
    const page = await context.newPage();

    if (manHinh.vaiTro) {
      // Đúng key + hình dạng mà frontend/src/lib/auth-context.tsx thật sự đọc
      // (STORAGE_KEY = 'vlt_auth', lưu nguyên object AuthResponse) — đã đọc file thật
      // trước khi viết dòng này, không đoán tên key.
      const auth = tokenTheoVaiTro[manHinh.vaiTro];
      await page.addInitScript((authJson: string) => {
        (globalThis as any).localStorage.setItem('vlt_auth', authJson);
      }, JSON.stringify(auth));
    }

    await page.goto(`${FRONTEND_URL}${manHinh.route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(500);

    if (manHinh.choXuLy) {
      await manHinh.choXuLy(page);
    }

    const duongDanRa = path.join(THU_MUC_ANH, manHinh.file);
    await page.screenshot({ path: duongDanRa });
    console.log(`Đã chụp: ${manHinh.file}`);

    await context.close();
  }

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exitCode = 1;
});
