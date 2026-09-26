'use client';

import { FormEvent, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { ApiError } from '@/lib/api-client';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/toast';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  async function onSubmit(event: FormEvent) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);
    try {
      await login({ email, password });
      router.push('/');
    } catch (err) {
      const message = err instanceof ApiError ? err.message : 'Đăng nhập thất bại';
      setError(message);
      showToast(message, 'error');
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <main className="mx-auto flex max-w-md flex-col gap-6 px-4 py-10 md:px-6">
      <h1 className="text-2xl font-bold">Đăng nhập</h1>

      <form className="flex flex-col gap-4" onSubmit={onSubmit} noValidate>
        <Input
          label="Email"
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <Input
          label="Mật khẩu"
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={error ?? undefined}
        />
        <Button type="submit" variant="primary" loading={isSubmitting}>
          Đăng nhập
        </Button>
      </form>

      <p className="text-sm text-muted">
        Chưa có tài khoản?{' '}
        <Link href="/dang-ky" className="font-medium text-primary">
          Đăng ký
        </Link>
      </p>
    </main>
  );
}
