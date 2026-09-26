'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Button } from '@/components/ui/button';
import { NotificationBell } from '@/components/notification-bell';

interface NavLink {
  href: string;
  label: string;
}

function getLinksForRole(role: string | undefined): NavLink[] {
  switch (role) {
    case 'CANDIDATE':
      return [
        { href: '/', label: 'Tìm việc' },
        { href: '/ho-so', label: 'Hồ sơ của tôi' },
      ];
    case 'EMPLOYER':
      return [
        { href: '/nha-tuyen-dung/dang-tin', label: 'Đăng tin' },
        { href: '/nha-tuyen-dung/tin-cua-toi', label: 'Tin của tôi' },
      ];
    case 'ADMIN':
      return [{ href: '/quan-tri', label: 'Quản trị' }];
    default:
      return [{ href: '/', label: 'Tìm việc làm' }];
  }
}

export function Navbar() {
  const { user, logout } = useAuth();
  const [menuOpen, setMenuOpen] = useState(false);
  const links = getLinksForRole(user?.role);

  return (
    <header className="border-b border-border bg-white">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-3 md:px-6">
        <Link href="/" className="text-lg font-bold text-primary">
          Việc Làm Thêm
        </Link>

        <nav className="hidden items-center gap-6 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-sm font-medium text-slate-700 hover:text-primary"
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <NotificationBell />
              <span className="text-sm text-muted">{user.fullName}</span>
              <Button variant="ghost" onClick={logout}>
                Đăng xuất
              </Button>
            </>
          ) : (
            <>
              <Link href="/dang-nhap">
                <Button variant="ghost">Đăng nhập</Button>
              </Link>
              <Link href="/dang-ky">
                <Button variant="primary">Đăng ký</Button>
              </Link>
            </>
          )}
        </div>

        <div className="flex items-center gap-1 md:hidden">
          {user && <NotificationBell />}
          <button
            type="button"
            className="min-h-11 min-w-11"
            aria-label="Mở menu"
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span className="block h-0.5 w-6 bg-slate-900" />
            <span className="mt-1.5 block h-0.5 w-6 bg-slate-900" />
            <span className="mt-1.5 block h-0.5 w-6 bg-slate-900" />
          </button>
        </div>
      </div>

      {menuOpen && (
        <nav className="flex flex-col gap-1 border-t border-border px-4 py-3 md:hidden">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setMenuOpen(false)}
              className="rounded-md px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              {link.label}
            </Link>
          ))}
          {user ? (
            <button
              type="button"
              onClick={() => {
                logout();
                setMenuOpen(false);
              }}
              className="rounded-md px-2 py-2 text-left text-sm font-medium text-slate-700 hover:bg-slate-50"
            >
              Đăng xuất ({user.fullName})
            </button>
          ) : (
            <>
              <Link
                href="/dang-nhap"
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-slate-700 hover:bg-slate-50"
              >
                Đăng nhập
              </Link>
              <Link
                href="/dang-ky"
                onClick={() => setMenuOpen(false)}
                className="rounded-md px-2 py-2 text-sm font-medium text-primary hover:bg-slate-50"
              >
                Đăng ký
              </Link>
            </>
          )}
        </nav>
      )}
    </header>
  );
}
