import { IResultReadService } from "../results/IResultReadService";
import { IEmailService } from "../emailSend/IEmailService";
import { NotificationModel } from "../notifications/models/NotificationModel";
import { INotificationsFacade } from "../notifications/NotificationsFacade";
import { ScrapperResult } from "./models/ScrapperResult";

function assignOptValue(opt: any, propName: string, value: any){
    if(value == "true"){
        opt[propName] = true;
    }
    else if(value == "false"){
        opt[propName] = false;
    }
    else{
        opt[propName] = value;
    }
}

export function parseScrapperOptions<T>(type: string, argv: any){
    const opt: any = {};    
    for(const propName of Object.getOwnPropertyNames(argv)){
        if(type.length > 0 && propName.indexOf(type) == 0 && propName.indexOf('-') != -1){
            const argName = propName.replace(new RegExp(`^${type}-`), "");
            assignOptValue(opt, argName, argv[propName]);
        }
        else if(type.length == 0){
            assignOptValue(opt, propName, argv[propName]);
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
    constructor(implId: ScrapperImplId, readonly version: string){
        this.id = implId;
    }

    abstract start(externalServices: ExternalServices, scrapperResult: ScrapperResult, argv?: any): Promise<void>;
}