import { INotificationSender } from './NotificationSender';
import { NotificationModel } from "./NotificationModel";
import { INotificationsStorageService } from './NotificationsStorageService';
import { logger } from '../Logging';

export default class NotificationsFacade {
    private _notificationIdentifierFactory: (model: NotificationModel) => string = null!;

    constructor(
        private notificationSender: INotificationSender,
        private notificationsStorageService: INotificationsStorageService,
        notificationIdentifierFactory: (model: NotificationModel) => string,
    ) {
      this._notificationIdentifierFactory = notificationIdentifierFactory;
    }

    async sendNotifications(notifications: NotificationModel[]): Promise<boolean> {

      for (const notification of notifications) {
          if (!notification.notificationIdentifier) {
          notification.assignnotificationIdentifier(this._notificationIdentifierFactory(notification));
          }
    
          if (await this.notificationsStorageService.getNotificationByNotificationId(notification.notificationIdentifier)) {
            logger.info(`Notification ${notification.notificationIdentifier} already exists`)
          }else{
            const addResult = await this.notificationsStorageService.addNotification(notification);
          }
          const sendResult = await this.notificationSender.sendNotification(notification);
      }

      return true;
    }
}
