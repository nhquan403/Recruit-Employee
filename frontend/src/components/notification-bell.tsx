'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { usePollingNotifications } from '@/lib/use-polling-notifications';
import { formatRelativeTime } from '@/lib/format-relative-time';

export function NotificationBell() {
  const { unreadCount, notifications, refetchList, markRead, markAllRead } =
    usePollingNotifications();
  const [open, setOpen] = useState(false);
  const router = useRouter();

  function toggleOpen() {
    const next = !open;
    setOpen(next);
    if (next) refetchList();
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={toggleOpen}
        aria-label={unreadCount > 0 ? `Thông báo, ${unreadCount} chưa đọc` : 'Thông báo'}
        className="relative flex h-11 w-11 items-center justify-center rounded-full hover:bg-slate-100"
      >
        <span aria-hidden="true">🔔</span>
        {unreadCount > 0 && (
          <span className="absolute right-1 top-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-semibold text-white">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border border-border bg-white shadow-md">
          <div className="flex items-center justify-between border-b border-border px-3 py-2">
            <span className="text-sm font-semibold">Thông báo</span>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={() => markAllRead()}
                className="text-xs font-medium text-primary"
              >
                Đánh dấu tất cả đã đọc
              </button>
            )}
          </div>
          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 && (
              <p className="px-3 py-4 text-center text-sm text-muted">Không có thông báo</p>
            )}
            {notifications.map((notification) => (
              <button
                key={notification.id}
                type="button"
                onClick={() => {
                  markRead(notification.id);
                  setOpen(false);
                  if (notification.link) router.push(notification.link);
                }}
                className={`block w-full border-b border-border px-3 py-2 text-left text-sm last:border-0 hover:bg-slate-50 ${
                  notification.isRead ? 'text-muted' : 'font-medium text-slate-900'
                }`}
              >
                <p>{notification.message}</p>
                <p className="mt-0.5 text-xs text-muted">
                  {formatRelativeTime(notification.createdAt)}
                </p>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
