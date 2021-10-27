import { IResultReadService } from "../results/IResultReadService";
import { IEmailService } from "../emailSend/IEmailService";
import { NotificationModel } from "../notifications/models/NotificationModel";
import { INotificationsFacade } from "../notifications/NotificationsFacade";
import { ScrapperResult } from "./models/ScrapperResult";

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

export type ScrapperImplId = string;

export interface ExternalServices{
    notificationsFacade: INotificationsFacade;
    emailService: IEmailService;
    resultReadService: IResultReadService;
}

export abstract class ScrapperImplBase{
    readonly id: ScrapperImplId;
    constructor(implId: ScrapperImplId){
        this.id = implId;
    }

    abstract start(externalServices: ExternalServices, scrapperResult: ScrapperResult, argv?: any): Promise<void>;
}