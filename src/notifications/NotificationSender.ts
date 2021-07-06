import { NotificationModel } from './NotificationModel';

export interface INotificationSender {
    sendNotification(notification: NotificationModel): Promise<any>;
}

