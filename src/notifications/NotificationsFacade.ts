import { INotificationSenderService } from './NotificationSenderService';
import { NotificationModel } from "./models/NotificationModel";
import { INotificationsStorageService } from './NotificationsStorageService';
import { logger } from '../Logging';

export interface INotificationsFacade{
  sendNotifications(notifications: NotificationModel[], titleMerged: string, bodyMerged: string): Promise<boolean>;
}

export class NotificationsFacade implements INotificationsFacade {

    constructor(
        private notificationSenderService: INotificationSenderService,
        private notificationsStorageService: INotificationsStorageService,
    ) {
    }

    async sendNotifications(notifications: NotificationModel[], titleMerged: string, bodyMerged: string): Promise<boolean> {
      const uniqueScrapprerImplIds = notifications.map(v => v.scrapperImplId).filter((value, index, array) => array.indexOf(value) === index);
      const uniqueScrapprerResultIds = notifications.map(v => v.scrapperResultId).filter((value, index, array) => array.indexOf(value) === index);
      let toSend: NotificationModel[] = []
      if(uniqueScrapprerImplIds.length > 1){
        throw new Error(`Notifications cannot be sent for more than 1 implId`);
      }
      if(uniqueScrapprerResultIds.length > 1){
        throw new Error(`Notifications cannot be sent for more than 1 resultIds`);
      }
      for (const notification of notifications) {    
          if (await this.notificationsStorageService.getNotificationByNotificationId(notification.notificationIdentifier)) {
            logger.info(`Notification ${notification.notificationIdentifier} already exists and won't be sent.`)
            continue;
          }else{
            const addResult = await this.notificationsStorageService.addNotification(notification);
            toSend.push(notification);
          }
      }

      let allSent = false;
      if(toSend.length == 1){
        allSent = await this.notificationSenderService.sendNotification(toSend[0]);
        allSent = allSent != undefined;
      }else if (toSend.length > 0){
        const mergedNotification = new NotificationModel(
          "",
          toSend[0].scrapperImplId,
          toSend[0].scrapperResultId,
          titleMerged,
          bodyMerged,
          toSend.map(n => n.url).reduce((prev, curr) => prev + ";" + curr)
        )
        allSent = await this.notificationSenderService.sendNotification(mergedNotification)
        allSent = allSent != undefined;
      }


      return allSent;
    }
}
