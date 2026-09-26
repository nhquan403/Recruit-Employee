'use client';

import { useCallback, useEffect, useState } from 'react';
import { apiFetch } from './api-client';
import { useAuth } from './auth-context';

const NOTIFICATION_POLL_MS = 20000;

export interface NotificationItem {
  id: string;
  type: string;
  message: string;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

export function usePollingNotifications() {
  const { user, accessToken } = useAuth();
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);

  const refetchUnreadCount = useCallback(() => {
    if (!accessToken) return;
    apiFetch<{ count: number }>('/notifications/mine/unread-count', { token: accessToken })
      .then((res) => setUnreadCount(res.count))
      .catch(() => undefined);
  }, [accessToken]);

  const refetchList = useCallback(() => {
    if (!accessToken) return;
    apiFetch<NotificationItem[]>('/notifications/mine', { token: accessToken })
      .then(setNotifications)
      .catch(() => undefined);
  }, [accessToken]);

  useEffect(() => {
    if (!user || !accessToken) return;

    refetchUnreadCount();

    function tick() {
      if (document.visibilityState === 'visible') {
        refetchUnreadCount();
      }
    }

    const interval = setInterval(tick, NOTIFICATION_POLL_MS);
    document.addEventListener('visibilitychange', tick);
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', tick);
    };
  }, [user, accessToken, refetchUnreadCount]);

  async function markRead(id: string) {
    await apiFetch(`/notifications/${id}/read`, { method: 'PATCH', token: accessToken });
    setNotifications((current) =>
      current.map((n) => (n.id === id ? { ...n, isRead: true } : n)),
    );
    refetchUnreadCount();
  }

  async function markAllRead() {
    await apiFetch('/notifications/read-all', { method: 'PATCH', token: accessToken });
    setNotifications((current) => current.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  }

  return { unreadCount, notifications, refetchList, markRead, markAllRead };
}
