'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { RequireRole } from '@/components/require-role';
import { useAuth } from '@/lib/auth-context';
import { apiFetch, ApiError } from '@/lib/api-client';
import { Application, ApplicationStatus, Job } from '@/lib/job-types';
import { ApplicationRow } from '@/components/application-row';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/components/ui/toast';

function ManageApplicantsView() {
  const params = useParams<{ id: string }>();
  const jobId = params.id;
  const { accessToken } = useAuth();
  const { showToast } = useToast();

  const [job, setJob] = useState<Job | null>(null);
  const [applications, setApplications] = useState<Application[] | null>(null);

  useEffect(() => {
    if (!accessToken) return;
    apiFetch<Job[]>('/jobs/mine', { token: accessToken })
      .then((jobs) => setJob(jobs.find((j) => j.id === jobId) ?? null))
      .catch(() => setJob(null));
    apiFetch<Application[]>(`/jobs/${jobId}/applications`, { token: accessToken })
      .then(setApplications)
      .catch(() => setApplications([]));
  }, [accessToken, jobId]);

  async function handleStatusChange(applicationId: string, status: ApplicationStatus) {
    try {
      const updated = await apiFetch<Application>(`/applications/${applicationId}/status`, {
        method: 'PATCH',
        token: accessToken,
        body: { status },
      });
      setApplications(
        (current) =>
          current?.map((app) => (app.id === applicationId ? { ...app, ...updated } : app)) ??
          current,
      );
      showToast('Đã cập nhật trạng thái', 'success');
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : 'Cập nhật thất bại', 'error');
    }
  }

  return (
    <main className="mx-auto flex max-w-3xl flex-col gap-6 px-4 py-10 md:px-6">
      <div>
        <Link href="/nha-tuyen-dung/tin-cua-toi" className="text-sm text-primary">
          ← Tin của tôi
        </Link>
        <h1 className="mt-1 text-2xl font-bold">
          Ứng viên{job ? `: ${job.title}` : ''}
        </h1>
        <p className="text-sm text-muted">{applications?.length ?? 0} ứng viên</p>
      </div>

      {applications === null && <p className="text-sm text-muted">Đang tải...</p>}

      {applications !== null && applications.length === 0 && (
        <EmptyState
          title="Chưa có ứng viên nào"
          description="Ứng viên ứng tuyển sẽ hiển thị tại đây."
        />
      )}

      {applications && applications.length > 0 && (
        <div className="flex flex-col gap-3">
          {applications.map((application) => (
            <ApplicationRow
              key={application.id}
              application={application}
              variant="employer"
              onStatusChange={(status) => handleStatusChange(application.id, status)}
            />
          ))}
        </div>
      )}
    </main>
  );
}

export default function ManageApplicantsPage() {
  return (
    <RequireRole allow={['EMPLOYER']}>
      <ManageApplicantsView />
    </RequireRole>
  );
}
