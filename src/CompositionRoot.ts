import { FirebaseNotificationSenderService } from "./notifications/impl/FirebaseNotificationSenderService";
import { FirestoreNotificationsStorageService } from "./notifications/impl/FirestoreNotificationsStorageService";
import { INotificationSenderService } from "./notifications/NotificationSenderService";
import { INotificationsStorageService } from "./notifications/NotificationsStorageService";
import { FirebaseResultUploadService } from "./resultUpload/impl/FirebaseResultUploadService";
import { IResultUploadService } from "./resultUpload/IResultUploadService";

const resultUploadService: IResultUploadService = new FirebaseResultUploadService();
const notificationSenderService: INotificationSenderService = new FirebaseNotificationSenderService();
const notificationsStorageService: INotificationsStorageService = new FirestoreNotificationsStorageService();

export {resultUploadService, notificationSenderService, notificationsStorageService}