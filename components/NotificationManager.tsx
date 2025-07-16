
import React from 'react';
import { useNotification } from '../contexts/NotificationContext';
import type { NotificationType } from '../types';

const Notification: React.FC<{ message: string, type: NotificationType, onDismiss: () => void }> = ({ message, type, onDismiss }) => {
  const baseClasses = 'p-4 rounded-md shadow-lg flex items-center text-white text-sm font-medium w-full';
  
  const typeStyles: Record<NotificationType, { bg: string; icon: JSX.Element }> = {
    success: {
      bg: 'bg-green-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    error: {
      bg: 'bg-red-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
    info: {
      bg: 'bg-blue-500',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )
    },
  };

  return (
    <div className={`${baseClasses} ${typeStyles[type].bg}`}>
      {typeStyles[type].icon}
      <span className="flex-grow">{message}</span>
      <button onClick={onDismiss} className="ml-4 -mr-1 p-1 rounded-md hover:bg-white/20 focus:outline-none focus:ring-2 focus:ring-white">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
};

const NotificationManager: React.FC = () => {
  const { notifications, removeNotification } = useNotification();

  if (!notifications.length) {
    return null;
  }

  return (
    <div className="fixed top-5 right-5 z-[100] space-y-3 w-full max-w-sm">
      {notifications.map(n => (
        <Notification
          key={n.id}
          message={n.message}
          type={n.type}
          onDismiss={() => removeNotification(n.id)}
        />
      ))}
    </div>
  );
};

export default NotificationManager;
