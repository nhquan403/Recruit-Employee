'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Role } from '@/lib/auth-types';

interface RequireRoleProps {
  allow: Role[];
  children: React.ReactNode;
}

export function RequireRole({ allow, children }: RequireRoleProps) {
  const { user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (isLoading) return;
    if (!user) {
      router.replace('/dang-nhap');
      return;
    }
    if (!allow.includes(user.role)) {
      router.replace('/');
    }
  }, [isLoading, user, allow, router]);

  if (isLoading || !user || !allow.includes(user.role)) {
    return null;
  }

  return <>{children}</>;
}
