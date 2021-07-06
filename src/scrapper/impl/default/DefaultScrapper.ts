import { NotificationModel } from "../../../notifications/NotificationModel";
import { ScrapperImpl } from "../ScrapperImpl";

export class DefaultScrapper extends ScrapperImpl{
    constructor(){
        super("Default")
    }

    start(): Promise<void> {
        console.log("Default scrapper started");
        return Promise.resolve()
    }

    notificationIdentifierFactory(model: NotificationModel): string {
        return `[Default]${model.title}${model.url}${model.body}`;
    }
}