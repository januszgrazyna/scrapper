import { INotificationSender, NotificationModel } from './NotificationSender';
import { INotificationsStorageService } from './NotificationsStorageService';

export default class NotificationsFacade {
    private _notificationIdentifierFactory: (model: NotificationModel) => string = null!;

    constructor(
        private notificationSender: INotificationSender,
        private notificationsStorageService: INotificationsStorageService,
        notificationIdentifierFactory: (model: NotificationModel) => string,
    ) {
      this._notificationIdentifierFactory = notificationIdentifierFactory;
    }

    async sendNotification(notification: NotificationModel): Promise<boolean> {
      if (!notification.notificationIdentifier) {
        notification.assignnotificationIdentifier(this._notificationIdentifierFactory(notification));
      }

      if (await this.notificationsStorageService.getNotificationByNotificationId(notification.notificationIdentifier)) {
        return false;
      }
      const sendResult = await this.notificationSender.sendNotification(notification);
      const addResult = await this.notificationsStorageService.addNotification(notification);
      return true;
    }
}
