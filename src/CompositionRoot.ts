import { IEmailService, GenericEmailServiceValidationDecorator } from "./emailSend/IEmailService";
import { NodemailerEmailService } from "./emailSend/NodemailerEmailService";
import { FirebaseNotificationSenderService } from "./notifications/impl/FirebaseNotificationSenderService";
import { FirestoreNotificationsStorageService } from "./notifications/impl/FirestoreNotificationsStorageService";
import { INotificationSenderService } from "./notifications/NotificationSenderService";
import { INotificationsFacade, NotificationsFacade } from "./notifications/NotificationsFacade";
import { INotificationsStorageService } from "./notifications/NotificationsStorageService";
import { FirebaseResultUploadService } from "./results/impl/FirebaseResultUploadService";
import { IResultUploadService } from "./results/IResultUploadService";
import { FirebaseScrapperDescriptorRead } from "./scrapper/FirebaseScrapperDescriptorRead";
import { IScrapperDescriptorRead } from "./scrapper/IScrapperDescriptorRead";
import * as path from 'path';
import { FirebaseResultReadService } from "./results/impl/FirebaseResultReadService";
import { IResultReadService } from "./results/IResultReadService";

const resultUploadService: IResultUploadService = new FirebaseResultUploadService();
const notificationSenderService: INotificationSenderService = new FirebaseNotificationSenderService();
const notificationsStorageService: INotificationsStorageService = new FirestoreNotificationsStorageService();
const scrapperDescriptorRead: IScrapperDescriptorRead = new FirebaseScrapperDescriptorRead("scrapperDescriptors");
const notificationsFacade: INotificationsFacade = new NotificationsFacade(notificationSenderService, notificationsStorageService);
const emailService: IEmailService = new GenericEmailServiceValidationDecorator(new NodemailerEmailService(path.join('src', 'dev', 'mailtrapSecrets.json'), "MAILTRAP_AUTH"));
const resultReadService: IResultReadService = new FirebaseResultReadService();

export {resultUploadService, resultReadService, notificationSenderService, notificationsStorageService, scrapperDescriptorRead, notificationsFacade, emailService}