import { INotificationSenderService } from './NotificationSenderService';
import { NotificationModel } from "./models/NotificationModel";
import { INotificationsStorageService } from './NotificationsStorageService';
import { logger } from '../Logging';

export interface INotificationsFacade{
  sendNotifications(notifications: NotificationModel[], notificationIdentifierFactory: (model: NotificationModel) => string): Promise<boolean>;
}

export class NotificationsFacade implements INotificationsFacade {

    constructor(
        private notificationSenderService: INotificationSenderService,
        private notificationsStorageService: INotificationsStorageService,
    ) {
    }

    async sendNotifications(notifications: NotificationModel[], notificationIdentifierFactory: (model: NotificationModel) => string): Promise<boolean> {

      for (const notification of notifications) {
          if (!notification.notificationIdentifier) {
          notification.assignnotificationIdentifier(notificationIdentifierFactory(notification));
          }
    
          if (await this.notificationsStorageService.getNotificationByNotificationId(notification.notificationIdentifier)) {
            logger.info(`Notification ${notification.notificationIdentifier} already exists`)
          }else{
            const addResult = await this.notificationsStorageService.addNotification(notification);
          }
          const sendResult = await this.notificationSenderService.sendNotification(notification);
      }

      return true;
    }
}
