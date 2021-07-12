import { INotificationSender } from "../../notifications/NotificationSender";
import { NotificationModel } from "../../notifications/NotificationModel";
import NotificationsFacade from "../../notifications/NotificationsFacade";

export function parseScrapperOptions<T>(type: string, argv: any){
    const opt: any = {};    
    for(const propName of Object.getOwnPropertyNames(argv)){
        if(propName.indexOf(type) == 0 && propName.indexOf('-') != -1){
            const argName = propName.replace(new RegExp(`^${type}-`), "");
            opt[argName]=argv[propName];
        }
    }
    return opt as T;
}

export abstract class ScrapperImpl{
    readonly scrapperType: string;
    constructor(scrapperType: string){
        this.scrapperType = scrapperType;
    }

    abstract notificationIdentifierFactory(model: NotificationModel): string;
    abstract start(notificationsFacade: NotificationsFacade, argv?: any): Promise<any>;
}