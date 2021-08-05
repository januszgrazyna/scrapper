import { NotificationModel } from "../models/NotificationModel";
import { admin } from "../../firebase";
import { INotificationsStorageService } from "../NotificationsStorageService";



export class FirestoreNotificationsStorageService implements INotificationsStorageService {
    addNotification(notification: NotificationModel): Promise<any> {
        const notifications = admin.firestore().collection("notifications");
        const { id, ...notificationData } = notification;
        const data = notificationData as any;
        for (const key in data) {
            if (Object.prototype.hasOwnProperty.call(notificationData, key) && data[key] instanceof Date) {
                data[key] = data[key].toJSON()
            }
        }
        return notifications.doc(notification.id).set(data);
    }
    deleteNotification(id: any): Promise<any> {
        const notifications = admin.firestore().collection("notifications");
        return notifications.doc(id).delete();
    }
    async getNotification(id: any): Promise<NotificationModel> {
        const notifications = admin.firestore().collection("notifications");
        const notification = await notifications.doc(id).get();
        return { ...notification.data(), id } as NotificationModel;
    }
    getAllNotifications(): Promise<NotificationModel[]> {
        return Promise.resolve([]);
    }

    async getNotificationByNotificationId(id: string): Promise<NotificationModel | null> {
        const notifications = admin.firestore().collection("notifications");
        const notification = await notifications.where("_notificationIdentifier", "==", id).get();
        return notification.docs.length > 0 ? NotificationModel.fromLiteral(notification.docs[0].data()) : null;
    }
}
