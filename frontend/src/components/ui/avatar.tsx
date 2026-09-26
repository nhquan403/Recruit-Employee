import { cn } from '@/lib/cn';

interface AvatarProps {
  name: string;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const sizeClasses = {
  sm: 'h-8 w-8 text-xs',
  md: 'h-11 w-11 text-sm',
  lg: 'h-16 w-16 text-lg',
};

function getInitials(name: string): string {
  const parts = name.trim().split(/\s+/);
  const initials = parts.length === 1 ? parts[0]?.slice(0, 2) : `${parts[0]?.[0] ?? ''}${parts[parts.length - 1]?.[0] ?? ''}`;
  return (initials ?? '?').toUpperCase();
}

export function Avatar({ name, size = 'md', className }: AvatarProps) {
  return (
    <span
      role="img"
      aria-label={name}
      className={cn(
        'inline-flex select-none items-center justify-center rounded-full bg-sky-100 font-semibold text-primary',
        sizeClasses[size],
        className,
      )}
    >
      {getInitials(name)}
    </span>
  );
}
