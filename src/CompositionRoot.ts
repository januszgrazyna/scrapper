import { FirebaseNotificationSender } from "./notifications/impl/FirebaseNotificationSender";
import { FirestoreNotificationsStorageService } from "./notifications/impl/FirestoreNotificationsStorageService";
import { INotificationSender } from "./notifications/NotificationSender";
import { INotificationsStorageService } from "./notifications/NotificationsStorageService";
import { FirebaseRunUpload } from "./runUpload/impl/FirebaseRunUpload";
import { IRunUpload } from "./runUpload/IRunUpload";

const runUpload: IRunUpload = new FirebaseRunUpload();
const notificationSender: INotificationSender = new FirebaseNotificationSender();
const notificationsStorageService: INotificationsStorageService = new FirestoreNotificationsStorageService();

export {runUpload, notificationSender, notificationsStorageService}