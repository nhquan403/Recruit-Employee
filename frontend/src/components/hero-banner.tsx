import Image from 'next/image';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export function HeroBanner() {
  return (
    <section className="relative mb-6 overflow-hidden rounded-lg md:mb-10">
      <Image
        src="/images/hero-viec-lam.jpg"
        alt="Nhân viên bán hàng làm việc part-time tại quầy thu ngân"
        width={1600}
        height={1067}
        priority
        className="h-[260px] w-full object-cover md:h-[340px]"
      />
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/80 via-slate-900/55 to-slate-900/10" />
      <div className="absolute inset-0 flex flex-col justify-center gap-3 px-6 md:px-12">
        <h1 className="max-w-xl text-2xl font-bold text-white md:text-4xl">
          Tìm việc làm thêm phù hợp với lịch học của bạn
        </h1>
        <p className="max-w-md text-sm text-slate-100 md:text-base">
          Hàng trăm tin tuyển dụng theo ca, thời vụ từ cửa hàng, quán ăn, doanh nghiệp nhỏ gần
          bạn — ứng tuyển chỉ trong một bước.
        </p>
        <div className="mt-2 flex flex-wrap gap-3">
          <Link href="/dang-ky">
            <Button variant="primary">Đăng ký miễn phí</Button>
          </Link>
          <Link href="/nha-tuyen-dung/dang-tin">
            <Button variant="secondary" className="bg-white/90">
              Đăng tin tuyển dụng
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}
