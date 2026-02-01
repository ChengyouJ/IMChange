import { writable } from 'svelte/store';

export type Notification = {
    id: string;
    message: string;
    type: 'success' | 'info' | 'warning' | 'error';
    link?: string;
    linkText?: string;
    duration?: number;
};

function createNotificationStore() {
    const { subscribe, update } = writable<Notification[]>([]);

    return {
        subscribe,
        add: (notification: Omit<Notification, 'id'>) => {
            const id = Math.random().toString(36).substr(2, 9);
            const newNotification: Notification = {
                ...notification,
                id,
                duration: notification.duration ?? 5000
            };

            update(notifications => [...notifications, newNotification]);

            // Auto-remove after duration
            if (newNotification.duration > 0) {
                setTimeout(() => {
                    update(notifications =>
                        notifications.filter(n => n.id !== id)
                    );
                }, newNotification.duration);
            }

            return id;
        },
        remove: (id: string) => {
            update(notifications => notifications.filter(n => n.id !== id));
        },
        clear: () => {
            update(() => []);
        }
    };
}

export const notifications = createNotificationStore();
