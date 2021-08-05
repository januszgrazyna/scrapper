import { INotificationSenderService } from "../NotificationSenderService";
import { NotificationModel } from "../models/NotificationModel";
import { admin } from "../../firebase";

export class FirebaseNotificationSenderService implements INotificationSenderService {
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
            topic: FirebaseNotificationSenderService.topic
        };
        return admin.messaging().send(message);
    }
}