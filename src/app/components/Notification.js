'use client'
import { Toast } from "flowbite-react";
import { HiCheck, HiExclamation, HiX, HiInformationCircle } from "react-icons/hi";

// Componente individual de notificação
export const NotificationItem = ({ notification, onDismiss }) => {
  const getIcon = () => {
    switch (notification.type) {
      case 'success':
        return <HiCheck className="h-5 w-5" />;
      case 'error':
        return <HiX className="h-5 w-5" />;
      case 'warning':
        return <HiExclamation className="h-5 w-5" />;
      case 'info':
      default:
        return <HiInformationCircle className="h-5 w-5" />;
    }
  };

  const getIconStyles = () => {
    switch (notification.type) {
      case 'success':
        return "bg-green-100 text-green-500 dark:bg-green-800 dark:text-green-200";
      case 'error':
        return "bg-red-100 text-red-500 dark:bg-red-800 dark:text-red-200";
      case 'warning':
        return "bg-orange-100 text-orange-500 dark:bg-orange-700 dark:text-orange-200";
      case 'info':
      default:
        return "bg-blue-100 text-blue-500 dark:bg-blue-800 dark:text-blue-200";
    }
  };

  return (
    <Toast className="mb-2">
      <div className={`inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${getIconStyles()}`}>
        {getIcon()}
      </div>
      <div className="ml-3 text-sm font-normal">{notification.message}</div>
      <Toast.Toggle onDismiss={() => onDismiss(notification.id)} />
    </Toast>
  );
};

// Container de notificações
export const NotificationContainer = ({ notifications, onDismiss }) => {
  if (notifications.length === 0) return null;

  return (
    <div className="fixed bottom-4 left-0 w-full flex justify-center z-50">
      <div className="max-w-md w-full mx-4">
        {notifications.map((notification) => (
          <NotificationItem
            key={notification.id}
            notification={notification}
            onDismiss={onDismiss}
          />
        ))}
      </div>
    </div>
  );
};

// Componente legado para compatibilidade (será removido gradualmente)
export default function Notification({ type, message, setPattern }) {
  return (
    <div className="fixed bottom-4 left-0 w-full flex justify-center z-20">
      <NotificationItem
        notification={{ id: Date.now(), type, message }}
        onDismiss={() => setPattern(<></>)}
      />
    </div>
  );
}