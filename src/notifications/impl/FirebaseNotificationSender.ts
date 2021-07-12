import { INotificationSender } from "../NotificationSender";
import { NotificationModel } from "../NotificationModel";
import { admin } from "../../firebase";

export class FirebaseNotificationSender implements INotificationSender {
    static topic = "scrapper";

    async sendNotification(model: NotificationModel): Promise<any> {
        var message: admin.messaging.Message = {
            data: {
                title: model.title,
                body: model.body,
                url: model.url ?? "",
                id: model.id,
                scrapperRunId: model.scrapperRunId,
                options: NotificationModel.stringifiedOptions(model.options),
            },
            topic: FirebaseNotificationSender.topic
        };
        return admin.messaging().send(message);
    }
}