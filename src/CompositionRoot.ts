import { FirebaseNotificationSenderService } from "./notifications/impl/FirebaseNotificationSenderService";
import { FirestoreNotificationsStorageService } from "./notifications/impl/FirestoreNotificationsStorageService";
import { INotificationSenderService } from "./notifications/NotificationSenderService";
import { INotificationsStorageService } from "./notifications/NotificationsStorageService";
import { FirebaseRunUploadService } from "./runUpload/impl/FirebaseRunUploadService";
import { IRunUploadService } from "./runUpload/IRunUploadService";

const runUploadService: IRunUploadService = new FirebaseRunUploadService();
const notificationSenderService: INotificationSenderService = new FirebaseNotificationSenderService();
const notificationsStorageService: INotificationsStorageService = new FirestoreNotificationsStorageService();

export {runUploadService, notificationSenderService, notificationsStorageService}