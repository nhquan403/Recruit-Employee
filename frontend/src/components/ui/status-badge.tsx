import { cn } from '@/lib/cn';

export type StatusBadgeStatus = 'pending' | 'viewed' | 'interview' | 'approved' | 'rejected';

const statusClasses: Record<StatusBadgeStatus, string> = {
  pending: 'bg-status-pending-bg text-status-pending-text',
  viewed: 'bg-status-viewed-bg text-status-viewed-text',
  interview: 'bg-status-interview-bg text-status-interview-text',
  approved: 'bg-status-approved-bg text-status-approved-text',
  rejected: 'bg-status-rejected-bg text-status-rejected-text',
};

const defaultLabels: Record<StatusBadgeStatus, string> = {
  pending: 'Chờ duyệt',
  viewed: 'Đã xem',
  interview: 'Mời phỏng vấn',
  approved: 'Đã duyệt',
  rejected: 'Từ chối',
};

interface StatusBadgeProps {
  status: StatusBadgeStatus;
  label?: string;
  className?: string;
}

export function StatusBadge({ status, label, className }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-sm px-2.5 py-1 text-xs font-medium',
        statusClasses[status],
        className,
      )}
    >
      {label ?? defaultLabels[status]}
    </span>
  );
}
