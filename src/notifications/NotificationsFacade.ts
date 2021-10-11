import { INotificationSenderService } from './NotificationSenderService';
import { NotificationModel } from "./models/NotificationModel";
import { INotificationsStorageService } from './NotificationsStorageService';
import { logger } from '../Logging';

export interface INotificationsFacade{
  sendNotifications(notifications: NotificationModel[]): Promise<boolean>;
}

export class NotificationsFacade implements INotificationsFacade {

    constructor(
        private notificationSenderService: INotificationSenderService,
        private notificationsStorageService: INotificationsStorageService,
    ) {
    }

    async sendNotifications(notifications: NotificationModel[]): Promise<boolean> {
      let allSent = false;
      for (const notification of notifications) {    
          if (await this.notificationsStorageService.getNotificationByNotificationId(notification.notificationIdentifier)) {
            logger.info(`Notification ${notification.notificationIdentifier} already exists and won't be sent.`)
            continue;
          }else{
            const addResult = await this.notificationsStorageService.addNotification(notification);
          }
          allSent = await this.notificationSenderService.sendNotification(notification);
          allSent = allSent != undefined;
      }

      return allSent;
    }
}
