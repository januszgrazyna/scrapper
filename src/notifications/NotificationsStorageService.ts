import { NotificationModel } from "./models/NotificationModel";



export interface INotificationsStorageService {
    addNotification(notification: NotificationModel): Promise<any>;
    deleteNotification(id: any): Promise<any>;
    getNotification(id: any): Promise<NotificationModel>;
    getNotificationByNotificationId(id: string): Promise<NotificationModel | null>;
    getAllNotifications(): Promise<NotificationModel[]>;
}

export interface INotificationsCleanupService {
    startWatching(notificationTimeout: number, poolingInterval: number): void;
    stopWatching(): void;
}


