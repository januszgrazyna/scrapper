import { NotificationModel } from "../../../notifications/models/NotificationModel";
import NotificationsFacade from "../../../notifications/NotificationsFacade";
import { ScrapperResult } from "../../models/ScrapperRun";
import { parseScrapperOptions, ScrapperImplBase } from "../../ScrapperImplBase";
import { sleep } from "../../../utils";

export class DefaultScrapper extends ScrapperImplBase{
    constructor(){
        super("Default")
    }

    async start(notificationsFacade: NotificationsFacade, scrapperRun: ScrapperResult, argv?: any): Promise<void> {
        console.log("Default scrapper started");
        const opt = parseScrapperOptions<{sleep: number}>("default", argv);
        if(opt.sleep){
            console.log(`Sleeping ${opt.sleep}ms`);
            await sleep(opt.sleep);
        }
        await notificationsFacade.sendNotifications([
            new NotificationModel(scrapperRun.id, "title", "body")
        ])
        return Promise.resolve()
    }

    notificationIdentifierFactory(model: NotificationModel): string {
        return `[Default]${model.title}${model.url}${model.body}`;
    }
}