'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { apiFetch, ApiError } from '@/lib/api-client';
import { Application, ApplicationStatus, Job, formatSalary } from '@/lib/job-types';
import { ApplyButton } from '@/components/apply-button';
import { StatusBadge } from '@/components/ui/status-badge';
import { jobStatusToBadge } from '@/lib/job-types';

export default function JobDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const { user, accessToken, isLoading: authLoading } = useAuth();

  const [job, setJob] = useState<Job | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [appliedStatus, setAppliedStatus] = useState<ApplicationStatus | null>(null);

  useEffect(() => {
    // Wait for AuthProvider's localStorage hydration so an employer/admin viewing
    // their own non-approved job doesn't get a false 404 while still anonymous.
    if (authLoading) return;
    apiFetch<Job>(`/jobs/${params.id}`, { token: accessToken })
      .then(setJob)
      .catch((error) => {
        if (error instanceof ApiError && error.status === 404) setNotFound(true);
      });
  }, [params.id, accessToken, authLoading]);

  useEffect(() => {
    if (authLoading || !user || user.role !== 'CANDIDATE') return;
    apiFetch<Application[]>('/applications/mine', { token: accessToken })
      .then((applications) => {
        const existing = applications.find((a) => a.jobId === params.id);
        setAppliedStatus(existing?.status ?? null);
      })
      .catch(() => setAppliedStatus(null));
  }, [authLoading, user, accessToken, params.id]);

  if (notFound) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 text-center md:px-6">
        <p className="text-lg font-semibold">Không tìm thấy tin tuyển dụng</p>
        <button onClick={() => router.push('/')} className="mt-2 text-sm text-primary">
          ← Quay lại trang chủ
        </button>
      </main>
    );
  }

  if (!job) {
    return (
      <main className="mx-auto max-w-2xl px-4 py-10 md:px-6">
        <p className="text-sm text-muted">Đang tải...</p>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-6 pb-28 md:px-6 md:py-10 md:pb-10">
      <button onClick={() => router.back()} className="mb-4 text-sm text-primary">
        ← Quay lại
      </button>

      <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_320px]">
        <div className="flex flex-col gap-6">
          <div>
            <div className="flex items-start justify-between gap-2">
              <h1 className="text-2xl font-bold md:text-3xl">{job.title}</h1>
              {user && (user.id === job.employerId || user.role === 'ADMIN') && (
                <StatusBadge status={jobStatusToBadge(job.status)} />
              )}
            </div>
            <p className="mt-1 text-sm text-muted">📍 {job.area}</p>
            <p className="mt-2 text-lg font-semibold text-primary">{formatSalary(job)}</p>
            <p className="text-sm text-slate-700">{job.shift}</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold">Mô tả công việc</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
              {job.description}
            </p>
          </div>

          {job.requirements && (
            <div>
              <h2 className="text-lg font-semibold">Yêu cầu ứng viên</h2>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-slate-700">
                {job.requirements}
              </p>
            </div>
          )}
        </div>

        <div className="hidden lg:block">
          <div className="sticky top-4 flex flex-col gap-3 rounded-lg border border-border bg-white p-4">
            <p className="text-base font-semibold">{job.title}</p>
            <p className="text-sm font-semibold text-primary">{formatSalary(job)}</p>
            <p className="text-sm text-slate-700">{job.shift}</p>
            <ApplyButton job={job} initialApplicationStatus={appliedStatus} />
          </div>
        </div>
      </div>

      <div className="fixed inset-x-0 bottom-0 border-t border-border bg-white p-4 lg:hidden">
        <ApplyButton job={job} initialApplicationStatus={appliedStatus} />
      </div>
    </main>
  );
}
