'use client';

import { ButtonHTMLAttributes, HTMLAttributes } from 'react';
import { cn } from '@/lib/cn';

interface TagBaseProps {
  selected?: boolean;
  onRemove?: () => void;
}

type TagProps =
  | (TagBaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { onClick: () => void })
  | (TagBaseProps & HTMLAttributes<HTMLSpanElement> & { onClick?: undefined });

export function Tag({ selected = false, onRemove, className, children, ...props }: TagProps) {
  const baseClassName = cn(
    'inline-flex min-h-8 items-center gap-1 rounded-sm border px-2.5 py-1 text-xs font-medium',
    selected ? 'border-primary bg-sky-50 text-primary' : 'border-border bg-white text-slate-700',
    props.onClick && 'cursor-pointer',
    className,
  );

  const removeButton = onRemove && (
    <button
      type="button"
      onClick={onRemove}
      aria-label="Xóa"
      className="ml-1 rounded-full text-muted hover:text-slate-900"
    >
      ×
    </button>
  );

  if (props.onClick) {
    const { onClick, ...rest } = props as TagBaseProps & ButtonHTMLAttributes<HTMLButtonElement>;
    return (
      <button type="button" onClick={onClick} className={baseClassName} {...rest}>
        {children}
        {removeButton}
      </button>
    );
  }

  return (
    <span className={baseClassName} {...(props as HTMLAttributes<HTMLSpanElement>)}>
      {children}
      {removeButton}
    </span>
  );
}
