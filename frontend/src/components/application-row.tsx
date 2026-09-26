'use client';

import { Application, ApplicationStatus, applicationStatusToBadge, formatSalary } from '@/lib/job-types';
import { formatRelativeTime } from '@/lib/format-relative-time';
import { StatusBadge } from '@/components/ui/status-badge';
import { Avatar } from '@/components/ui/avatar';
import { Select } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

// Matches the backend's accepted PATCH values exactly (PENDING is never settable —
// the list endpoint already flips it to VIEWED as soon as the employer opens it).
const EMPLOYER_STATUS_OPTIONS: { value: ApplicationStatus; label: string }[] = [
  { value: 'VIEWED', label: 'Đã xem' },
  { value: 'INTERVIEW', label: 'Mời phỏng vấn' },
  { value: 'REJECTED', label: 'Từ chối' },
];

interface ApplicationRowProps {
  application: Application;
  variant: 'employer' | 'candidate';
  onStatusChange?: (status: ApplicationStatus) => void;
  onViewProfile?: () => void;
}

export function ApplicationRow({
  application,
  variant,
  onStatusChange,
  onViewProfile,
}: ApplicationRowProps) {
  return (
    <div className="flex flex-col gap-3 rounded-lg border border-border bg-white p-4">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {variant === 'employer' && application.candidate && (
            <Avatar name={application.candidate.fullName} size="sm" />
          )}
          <div>
            <p className="text-sm font-semibold text-slate-900">
              {variant === 'employer'
                ? (application.candidate?.fullName ?? 'Ứng viên')
                : (application.job?.title ?? 'Tin tuyển dụng')}
            </p>
            {variant === 'candidate' && application.job && (
              <p className="text-xs text-muted">
                {application.job.area} · {formatSalary(application.job)}
              </p>
            )}
            <p className="text-xs text-muted">Ứng tuyển: {formatRelativeTime(application.createdAt)}</p>
          </div>
        </div>

        {variant === 'candidate' ? (
          <StatusBadge status={applicationStatusToBadge(application.status)} />
        ) : null}
      </div>

      {variant === 'employer' && (
        <div className="flex flex-wrap items-center gap-3">
          <Select
            aria-label="Cập nhật trạng thái"
            value={application.status}
            options={EMPLOYER_STATUS_OPTIONS}
            onChange={(e) => onStatusChange?.(e.target.value as ApplicationStatus)}
            className="max-w-[180px]"
          />
          {onViewProfile && (
            <Button variant="ghost" onClick={onViewProfile}>
              Xem hồ sơ
            </Button>
          )}
        </div>
      )}
    </div>
  );
}
