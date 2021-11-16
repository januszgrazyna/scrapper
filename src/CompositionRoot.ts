import { IEmailService, GenericEmailServiceValidationDecorator } from "./emailSend/IEmailService";
import { NodemailerEmailService } from "./emailSend/NodemailerEmailService";
import { FirebaseNotificationSenderService } from "./firebase/FirebaseNotificationSenderService";
import { INotificationSenderService } from "./notifications/NotificationSenderService";
import { INotificationsFacade, NotificationsFacade } from "./notifications/NotificationsFacade";
import { INotificationsStorageService } from "./notifications/NotificationsStorageService";
import { FirebaseScrapperDescriptorRead } from "./firebase/FirebaseScrapperDescriptorRead";
import { IScrapperDescriptorRead } from "./scrapper/IScrapperDescriptorRead";
import * as path from 'path';
import { FirebaseResultReadService } from "./firebase/FirebaseResultReadService";
import { IResultReadService } from "./scrapper/IResultReadService";
import { IResultUploadService } from "./scrapper/IResultUploadService";
import { FirebaseResultUploadService, FirestoreNotificationsStorageService } from "./firebase";

const resultUploadService: IResultUploadService = new FirebaseResultUploadService();
const notificationSenderService: INotificationSenderService = new FirebaseNotificationSenderService();
const notificationsStorageService: INotificationsStorageService = new FirestoreNotificationsStorageService();
const scrapperDescriptorRead: IScrapperDescriptorRead = new FirebaseScrapperDescriptorRead("scrapperDescriptors");
const notificationsFacade: INotificationsFacade = new NotificationsFacade(notificationSenderService, notificationsStorageService);
const emailService: IEmailService = new GenericEmailServiceValidationDecorator(new NodemailerEmailService(path.join('src', 'dev', 'mailtrapSecrets.json'), "MAILTRAP_AUTH"));
const resultReadService: IResultReadService = new FirebaseResultReadService();

export {resultUploadService, resultReadService, notificationSenderService, notificationsStorageService, scrapperDescriptorRead, notificationsFacade, emailService}