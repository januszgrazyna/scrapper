import { IEmailService, GenericEmailServiceValidationDecorator } from "./emailSend/IEmailService";
import { MailtrapEmailService } from "./emailSend/MailtrapEmailService";
import { FirebaseNotificationSenderService } from "./notifications/impl/FirebaseNotificationSenderService";
import { FirestoreNotificationsStorageService } from "./notifications/impl/FirestoreNotificationsStorageService";
import { INotificationSenderService } from "./notifications/NotificationSenderService";
import { INotificationsFacade, NotificationsFacade } from "./notifications/NotificationsFacade";
import { INotificationsStorageService } from "./notifications/NotificationsStorageService";
import { FirebaseResultUploadService } from "./resultUpload/impl/FirebaseResultUploadService";
import { IResultUploadService } from "./resultUpload/IResultUploadService";
import { FirebaseScrapperDescriptorRead } from "./scrapper/FirebaseScrapperDescriptorRead";
import { IScrapperDescriptorRead } from "./scrapper/IScrapperDescriptorRead";

const resultUploadService: IResultUploadService = new FirebaseResultUploadService();
const notificationSenderService: INotificationSenderService = new FirebaseNotificationSenderService();
const notificationsStorageService: INotificationsStorageService = new FirestoreNotificationsStorageService();
const scrapperDescriptorRead: IScrapperDescriptorRead = new FirebaseScrapperDescriptorRead("scrapperDescriptors");
const notificationsFacade: INotificationsFacade = new NotificationsFacade(notificationSenderService, notificationsStorageService);
const emailService: IEmailService = new GenericEmailServiceValidationDecorator(new MailtrapEmailService());

export {resultUploadService, notificationSenderService, notificationsStorageService, scrapperDescriptorRead, notificationsFacade, emailService}