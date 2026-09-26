import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Việc Làm Thêm',
  description: 'Kết nối việc làm thêm, theo ca, thời vụ với nhà tuyển dụng gần bạn.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="vi">
      <body>{children}</body>
    </html>
  );
}
