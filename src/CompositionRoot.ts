import { IEmailService, GenericEmailServiceValidationDecorator } from "./emailSend/IEmailService";
import { NodemailerEmailService } from "./emailSend/NodemailerEmailService";
import { FirebaseNotificationSenderService } from "./firebaseServices/FirebaseNotificationSenderService";
import { INotificationSenderService } from "./notifications/NotificationSenderService";
import { INotificationsFacade, NotificationsFacade } from "./notifications/NotificationsFacade";
import { INotificationsStorageService } from "./notifications/NotificationsStorageService";
import { FirebaseScrapperDescriptorRead } from "./firebaseServices/FirebaseScrapperDescriptorRead";
import * as path from 'path';
import { FirebaseResultReadService } from "./firebaseServices/FirebaseResultReadService";
import { IResultReadService } from "./scrapper/services/IResultReadService";
import { FirebaseResultUploadService, FirestoreNotificationsStorageService } from "./firebaseServices";
import { IScrapperDescriptorRead } from "./scrapper/services/IScrapperDescriptorRead";
import { IResultUploadService } from "./scrapper/services/IResultUploadService";

const resultUploadService: IResultUploadService = new FirebaseResultUploadService();
const notificationSenderService: INotificationSenderService = new FirebaseNotificationSenderService();
const notificationsStorageService: INotificationsStorageService = new FirestoreNotificationsStorageService();
const scrapperDescriptorRead: IScrapperDescriptorRead = new FirebaseScrapperDescriptorRead("scrapperDescriptors");
const notificationsFacade: INotificationsFacade = new NotificationsFacade(notificationSenderService, notificationsStorageService);
const emailService: IEmailService = new GenericEmailServiceValidationDecorator(new NodemailerEmailService(path.join('src', 'dev', 'mailtrapSecrets.json'), "MAILTRAP_AUTH"));
const resultReadService: IResultReadService = new FirebaseResultReadService();

export {resultUploadService, resultReadService, notificationSenderService, notificationsStorageService, scrapperDescriptorRead, notificationsFacade, emailService}