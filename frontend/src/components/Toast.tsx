'use client';

import React from 'react';
import { 
  CheckCircle2, 
  AlertCircle, 
  Info, 
  AlertTriangle, 
  X 
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Notification, useNotificationStore } from '@/store/notificationStore';

const icons = {
  success: CheckCircle2,
  error: AlertCircle,
  info: Info,
  warning: AlertTriangle,
};

const styles = {
  success: "bg-emerald-50 border-emerald-200 text-emerald-800 shadow-emerald-100",
  error: "bg-red-50 border-red-200 text-red-800 shadow-red-100",
  info: "bg-indigo-50 border-indigo-200 text-indigo-800 shadow-indigo-100",
  warning: "bg-amber-50 border-amber-200 text-amber-800 shadow-amber-100",
};

const iconColors = {
  success: "text-emerald-500",
  error: "text-red-500",
  info: "text-indigo-500",
  warning: "text-amber-500",
};

export function Toast({ notification }: { notification: Notification }) {
  const removeNotification = useNotificationStore((state) => state.removeNotification);
  const Icon = icons[notification.type];

  return (
    <div className={cn(
      "pointer-events-auto flex w-full max-w-md animate-in slide-in-from-right-full fade-in duration-300 overflow-hidden rounded-xl border shadow-lg",
      styles[notification.type]
    )}>
      <div className="flex w-full items-start gap-3 p-4">
        <Icon className={cn("mt-0.5 h-5 w-5 shrink-0", iconColors[notification.type])} />
        <div className="flex-1 space-y-1">
          {notification.title && (
            <p className="text-sm font-bold leading-none">{notification.title}</p>
          )}
          <p className="text-xs font-medium leading-relaxed opacity-90">{notification.message}</p>
        </div>
        <button
          onClick={() => removeNotification(notification.id)}
          className="ml-auto shrink-0 rounded-lg p-1 transition-colors hover:bg-black/5"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export function ToastContainer() {
  const notifications = useNotificationStore((state) => state.notifications);

  return (
    <div className="fixed top-4 right-4 z-[9999] flex w-full max-w-md flex-col gap-3 pointer-events-none">
      {notifications.map((n) => (
        <Toast key={n.id} notification={n} />
      ))}
    </div>
  );
}
