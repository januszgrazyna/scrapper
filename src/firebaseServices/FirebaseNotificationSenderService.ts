import { INotificationSenderService } from "../notifications/NotificationSenderService";
import { NotificationModel } from "../notifications/models/NotificationModel";
import { admin } from "./firebase";

export class FirebaseNotificationSenderService implements INotificationSenderService {
    static topic = "scrapper";

    async sendNotification(model: NotificationModel): Promise<any> {
        var message: admin.messaging.Message = {
            data: {
                title: model.title,
                body: model.body,
                url: model.url ?? "",
                scrapperImplId: model.scrapperImplId,
                scrapperResultId: model.scrapperResultId,
                options: NotificationModel.stringifiedOptions(model.options),
            },
            android:{
                "priority":"high"
            },
            topic: FirebaseNotificationSenderService.topic
        };
        return admin.messaging().send(message);
    }
}