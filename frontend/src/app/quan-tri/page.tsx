'use client';

import { useEffect, useState } from 'react';
import { RequireRole } from '@/components/require-role';
import { useAuth } from '@/lib/auth-context';
import { apiFetch, ApiError } from '@/lib/api-client';
import { Job, formatSalary } from '@/lib/job-types';
import { StatCard } from '@/components/stat-card';
import { Button } from '@/components/ui/button';
import { StatusBadge } from '@/components/ui/status-badge';
import { EmptyState } from '@/components/ui/empty-state';
import { useToast } from '@/components/ui/toast';
import { formatRelativeTime } from '@/lib/format-relative-time';

interface Stats {
  totalJobs: number;
  totalUsers: number;
  pendingJobs: number;
  totalApplications: number;
}

interface AdminJob extends Job {
  employer: { fullName: string; email: string };
}

interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  role: 'CANDIDATE' | 'EMPLOYER' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
}

const ROLE_LABELS: Record<AdminUser['role'], string> = {
  CANDIDATE: 'Ứng viên',
  EMPLOYER: 'Nhà tuyển dụng',
  ADMIN: 'Quản trị viên',
};

function AdminDashboard() {
  const { accessToken } = useAuth();
  const { showToast } = useToast();

  const [stats, setStats] = useState<Stats | null>(null);
  const [pendingJobs, setPendingJobs] = useState<AdminJob[] | null>(null);
  const [users, setUsers] = useState<AdminUser[] | null>(null);

  async function loadPendingJobs() {
    const data = await apiFetch<{ items: AdminJob[] }>('/admin/jobs?status=PENDING', {
      token: accessToken,
    });
    setPendingJobs(data.items);
  }

  // Fetch-on-mount for the 3 independent dashboard sections; loadPendingJobs is
  // reused as-is by the approve/reject handlers below to refresh after an action.
  /* eslint-disable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */
  useEffect(() => {
    if (!accessToken) return;
    apiFetch<Stats>('/admin/stats', { token: accessToken }).then(setStats);
    loadPendingJobs();
    apiFetch<AdminUser[]>('/admin/users', { token: accessToken }).then(setUsers);
  }, [accessToken]);
  /* eslint-enable react-hooks/set-state-in-effect, react-hooks/exhaustive-deps */

  async function handleApprove(jobId: string) {
    try {
      await apiFetch(`/admin/jobs/${jobId}/approve`, { method: 'PATCH', token: accessToken });
      showToast('Đã duyệt tin', 'success');
      loadPendingJobs();
      apiFetch<Stats>('/admin/stats', { token: accessToken }).then(setStats);
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : 'Duyệt tin thất bại', 'error');
    }
  }

  async function handleReject(jobId: string) {
    const reason = window.prompt('Lý do từ chối (không bắt buộc):') ?? undefined;
    try {
      await apiFetch(`/admin/jobs/${jobId}/reject`, {
        method: 'PATCH',
        token: accessToken,
        body: { reason },
      });
      showToast('Đã từ chối tin', 'success');
      loadPendingJobs();
      apiFetch<Stats>('/admin/stats', { token: accessToken }).then(setStats);
    } catch (error) {
      showToast(error instanceof ApiError ? error.message : 'Từ chối tin thất bại', 'error');
    }
  }

  return (
    <main className="mx-auto flex max-w-6xl flex-col gap-8 px-4 py-10 md:px-6">
      <h1 className="text-2xl font-bold">Trang quản trị</h1>

      <section>
        <h2 className="text-lg font-semibold">Tổng quan</h2>
        <div className="mt-3 flex gap-4 overflow-x-auto pb-2">
          <StatCard label="Tin tuyển dụng" value={stats?.totalJobs ?? 0} />
          <StatCard label="Người dùng" value={stats?.totalUsers ?? 0} />
          <StatCard label="Chờ duyệt" value={stats?.pendingJobs ?? 0} />
          <StatCard label="Lượt ứng tuyển" value={stats?.totalApplications ?? 0} />
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Tin chờ duyệt ({pendingJobs?.length ?? 0})</h2>
        {pendingJobs && pendingJobs.length === 0 && (
          <EmptyState title="Không có tin nào đang chờ duyệt" />
        )}
        <div className="mt-3 flex flex-col gap-3">
          {pendingJobs?.map((job) => (
            <div
              key={job.id}
              className="flex flex-col gap-2 rounded-lg border border-border bg-white p-4 md:flex-row md:items-center md:justify-between"
            >
              <div>
                <p className="font-semibold">{job.title}</p>
                <p className="text-sm text-muted">
                  {job.employer.fullName} · {job.area} · {formatSalary(job)} ·{' '}
                  {formatRelativeTime(job.createdAt)}
                </p>
                <StatusBadge status="pending" />
              </div>
              <div className="flex gap-2">
                <Button variant="primary" onClick={() => handleApprove(job.id)}>
                  Duyệt
                </Button>
                <Button variant="destructive" onClick={() => handleReject(job.id)}>
                  Từ chối
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold">Người dùng ({users?.length ?? 0})</h2>
        <div className="mt-3 overflow-x-auto rounded-lg border border-border bg-white">
          <table className="w-full min-w-[500px] text-left text-sm">
            <thead className="border-b border-border text-muted">
              <tr>
                <th className="px-4 py-2 font-medium">Tên</th>
                <th className="px-4 py-2 font-medium">Email</th>
                <th className="px-4 py-2 font-medium">Vai trò</th>
                <th className="px-4 py-2 font-medium">Ngày tạo</th>
              </tr>
            </thead>
            <tbody>
              {users?.map((u) => (
                <tr key={u.id} className="border-b border-border last:border-0">
                  <td className="px-4 py-2">{u.fullName}</td>
                  <td className="px-4 py-2">{u.email}</td>
                  <td className="px-4 py-2">{ROLE_LABELS[u.role]}</td>
                  <td className="px-4 py-2">{new Date(u.createdAt).toLocaleDateString('vi-VN')}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

export default function AdminPage() {
  return (
    <RequireRole allow={['ADMIN']}>
      <AdminDashboard />
    </RequireRole>
  );
}
