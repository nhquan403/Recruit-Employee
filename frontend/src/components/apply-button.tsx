'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { apiFetch, ApiError } from '@/lib/api-client';
import { Job, ApplicationStatus, applicationStatusToBadge } from '@/lib/job-types';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { useToast } from '@/components/ui/toast';

interface ApplyButtonProps {
  job: Job;
  initialApplicationStatus?: ApplicationStatus | null;
}

export function ApplyButton({ job, initialApplicationStatus = null }: ApplyButtonProps) {
  const { user, accessToken } = useAuth();
  const router = useRouter();
  const { showToast } = useToast();

  const [applicationStatus, setApplicationStatus] = useState(initialApplicationStatus);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isClosed, setIsClosed] = useState(job.status !== 'APPROVED');

  if (!user) {
    return (
      <Button
        variant="primary"
        onClick={() => router.push(`/dang-nhap?next=/viec-lam/${job.id}`)}
      >
        Đăng nhập để ứng tuyển
      </Button>
    );
  }

  if (user.role === 'EMPLOYER') {
    return (
      <p className="text-sm text-muted">Tài khoản nhà tuyển dụng không thể ứng tuyển</p>
    );
  }

  if (user.role === 'ADMIN') {
    return <p className="text-sm text-muted">Xem với vai trò quản trị</p>;
  }

  if (isClosed) {
    return (
      <Button variant="primary" disabled>
        Tin đã đóng
      </Button>
    );
  }

  if (applicationStatus) {
    return (
      <div className="flex items-center gap-2">
        <Button variant="primary" disabled>
          Đã ứng tuyển
        </Button>
        <StatusBadge status={applicationStatusToBadge(applicationStatus)} />
      </div>
    );
  }

  async function handleApply() {
    if (!window.confirm(`Xác nhận ứng tuyển vào "${job.title}"?`)) return;

    setIsSubmitting(true);
    try {
      await apiFetch('/applications', {
        method: 'POST',
        token: accessToken,
        body: { jobId: job.id },
      });
      setApplicationStatus('PENDING');
      showToast('Ứng tuyển thành công!', 'success');
    } catch (error) {
      if (error instanceof ApiError && error.status === 409) {
        setIsClosed(true);
        showToast('Tin tuyển dụng này không còn nhận hồ sơ', 'error');
      } else {
        showToast(error instanceof ApiError ? error.message : 'Ứng tuyển thất bại', 'error');
      }
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Button variant="primary" loading={isSubmitting} onClick={handleApply}>
      Ứng tuyển ngay
    </Button>
  );
}
