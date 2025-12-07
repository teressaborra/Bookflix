import React from 'react';
import Notification from './Notification';
import { useNotification } from '../hooks/useNotification';

const NotificationContainer: React.FC = () => {
    const { notifications, removeNotification } = useNotification();

    return (
        <div className="fixed top-4 right-4 z-50 space-y-2">
            {notifications.map((notification) => (
                <Notification
                    key={notification.id}
                    type={notification.type}
                    title={notification.title}
                    message={notification.message}
                    onClose={() => removeNotification(notification.id)}
                    duration={notification.duration}
                />
            ))}
        </div>
    );
};

export default NotificationContainer;