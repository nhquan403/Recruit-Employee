import Link from 'next/link';
import { Job, formatSalary, jobStatusToBadge } from '@/lib/job-types';
import { formatRelativeTime } from '@/lib/format-relative-time';
import { StatusBadge } from '@/components/ui/status-badge';

interface JobCardProps {
  job: Job;
  href?: string;
  showStatus?: boolean;
}

export function JobCard({ job, href, showStatus = false }: JobCardProps) {
  const content = (
    <div className="flex flex-col gap-2 rounded-lg border border-border bg-white p-4 transition-shadow duration-200 hover:shadow-md md:p-6">
      <div className="flex items-start justify-between gap-2">
        <h3 className="text-base font-semibold text-slate-900 md:text-lg">{job.title}</h3>
        {showStatus && <StatusBadge status={jobStatusToBadge(job.status)} />}
      </div>
      <p className="flex items-center gap-1 text-sm text-muted">📍 {job.area}</p>
      <p className="text-sm font-semibold text-primary">{formatSalary(job)}</p>
      <p className="text-sm text-slate-700">{job.shift}</p>
      <div className="flex items-center justify-between text-xs text-muted">
        <span>{formatRelativeTime(job.createdAt)}</span>
        {typeof job._count?.applications === 'number' && (
          <span>{job._count.applications} ứng viên</span>
        )}
      </div>
    </div>
  );

  if (!href) return content;

  return (
    <Link href={href} className="block">
      {content}
    </Link>
  );
}
