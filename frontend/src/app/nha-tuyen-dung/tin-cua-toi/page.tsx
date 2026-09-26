'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { RequireRole } from '@/components/require-role';
import { useAuth } from '@/lib/auth-context';
import { apiFetch } from '@/lib/api-client';
import { Job } from '@/lib/job-types';
import { JobCard } from '@/components/job-card';
import { EmptyState } from '@/components/ui/empty-state';
import { Button } from '@/components/ui/button';

function MyJobsList() {
  const { accessToken } = useAuth();
  const [jobs, setJobs] = useState<Job[] | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    apiFetch<Job[]>('/jobs/mine', { token: accessToken }).then(setJobs).catch(() => setJobs([]));
  }, [accessToken]);

  return (
    <main className="mx-auto flex max-w-4xl flex-col gap-6 px-4 py-10 md:px-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tin của tôi</h1>
        <Link href="/nha-tuyen-dung/dang-tin">
          <Button variant="primary">+ Đăng tin mới</Button>
        </Link>
      </div>

      {jobs === null && <p className="text-sm text-muted">Đang tải...</p>}

      {jobs !== null && jobs.length === 0 && (
        <EmptyState
          title="Bạn chưa đăng tin nào"
          description="Đăng tin đầu tiên để tìm ứng viên phù hợp."
          action={
            <Link href="/nha-tuyen-dung/dang-tin">
              <Button variant="primary">Đăng tin ngay</Button>
            </Link>
          }
        />
      )}

      {jobs && jobs.length > 0 && (
        <div className="flex flex-col gap-4">
          {jobs.map((job) => (
            <div key={job.id} className="flex flex-col gap-2">
              <JobCard job={job} showStatus />
              {job.status === 'REJECTED' && job.rejectReason && (
                <p className="text-xs text-destructive">Lý do từ chối: {job.rejectReason}</p>
              )}
              <Link
                href={`/nha-tuyen-dung/tin/${job.id}/ung-vien`}
                className="text-sm font-medium text-primary"
              >
                Quản lý ứng viên ({job._count?.applications ?? 0})
              </Link>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}

export default function MyJobsPage() {
  return (
    <RequireRole allow={['EMPLOYER']}>
      <MyJobsList />
    </RequireRole>
  );
}
