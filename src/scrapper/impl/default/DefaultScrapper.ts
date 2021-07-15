import { NotificationModel } from "../../../notifications/NotificationModel";
import NotificationsFacade from "../../../notifications/NotificationsFacade";
import { ScrapperRun } from "../../ScrapperRun";
import { ScrapperImpl } from "../../ScrapperImpl";

export class DefaultScrapper extends ScrapperImpl{
    constructor(){
        super("Default")
    }

    async start(notificationsFacade: NotificationsFacade, scrapperRun: ScrapperRun, argv?: any): Promise<void> {
        console.log("Default scrapper started");
        await notificationsFacade.sendNotifications([
            new NotificationModel(scrapperRun.id, "title", "body")
        ])
        return Promise.resolve()
    }

    notificationIdentifierFactory(model: NotificationModel): string {
        return `[Default]${model.title}${model.url}${model.body}`;
    }
}