'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Role } from '@/lib/auth-types';
import { ApiError } from '@/lib/api-client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

type RegisterRole = Extract<Role, 'CANDIDATE' | 'EMPLOYER'>;

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [role, setRole] = useState<RegisterRole>('CANDIDATE');
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  function validate(): boolean {
    const nextErrors: Record<string, string> = {};
    if (!fullName.trim() || fullName.trim().length < 2) {
      nextErrors.fullName = 'Vui lòng nhập họ tên (ít nhất 2 ký tự)';
    }
    if (!/^\S+@\S+\.\S+$/.test(email)) {
      nextErrors.email = 'Email không hợp lệ';
    }
    if (password.length < 8) {
      nextErrors.password = 'Mật khẩu phải có ít nhất 8 ký tự';
    }
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);
    try {
      await register({ email, password, role, fullName, phone: phone || undefined });
      showToast('Đăng ký thành công!', 'success');
      router.push(role === 'EMPLOYER' ? '/nha-tuyen-dung/dang-tin' : '/');
    } catch (error) {
      const message = error instanceof ApiError ? error.message : 'Đăng ký thất bại';
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10 md:px-6">
      <h1 className="text-2xl font-bold">Đăng ký tài khoản</h1>

      <div className="flex gap-2 rounded-lg border border-border p-1">
        <button
          type="button"
          onClick={() => setRole('CANDIDATE')}
          className={`min-h-11 flex-1 rounded-md text-sm font-medium transition-colors ${
            role === 'CANDIDATE' ? 'bg-primary text-white' : 'text-slate-700'
          }`}
        >
          Tôi là ứng viên
        </button>
        <button
          type="button"
          onClick={() => setRole('EMPLOYER')}
          className={`min-h-11 flex-1 rounded-md text-sm font-medium transition-colors ${
            role === 'EMPLOYER' ? 'bg-primary text-white' : 'text-slate-700'
          }`}
        >
          Tôi là nhà tuyển dụng
        </button>
      </div>

      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <Input
          label="Họ và tên"
          required
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={errors.fullName}
        />
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
        />
        <Input
          label="Số điện thoại"
          type="tel"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />
        <Input
          label="Mật khẩu"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          helperText={!errors.password ? 'Ít nhất 8 ký tự' : undefined}
        />
        <Button type="submit" variant="primary" loading={isSubmitting}>
          Đăng ký
        </Button>
      </form>

      <p className="text-sm text-muted">
        Đã có tài khoản?{' '}
        <Link href="/dang-nhap" className="font-medium text-primary">
          Đăng nhập
        </Link>
      </p>
    </main>
  );
}
