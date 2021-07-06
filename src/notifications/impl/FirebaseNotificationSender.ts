import { INotificationSender } from "../NotificationSender";
import { NotificationModel } from "../NotificationModel";
import { admin } from "../../firebase";

export class FirebaseNotificationSender implements INotificationSender {
    static topic = "scrapper";

    async sendNotification(options: NotificationModel): Promise<any> {
        var message: admin.messaging.Message = {
            data: {
                title: options.title,
                body: options.body,
                url: options.url ?? "",
                options: NotificationModel.stringifiedOptions(options.options),
            },
            topic: FirebaseNotificationSender.topic
        };
        return admin.messaging().send(message);
    }
}