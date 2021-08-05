import { NotificationModel } from './models/NotificationModel';

export interface INotificationSenderService {
    sendNotification(notification: NotificationModel): Promise<any>;
}

