import { NotificationModel } from "../notifications/models/NotificationModel";
import NotificationsFacade from "../notifications/NotificationsFacade";
import { ScrapperRun } from "./models/ScrapperRun";

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

export abstract class ScrapperImpl{
    readonly id: ScrapperImplId;
    constructor(implId: ScrapperImplId){
        this.id = implId;
    }

    abstract notificationIdentifierFactory(model: NotificationModel): string;
    abstract start(notificationsFacade: NotificationsFacade, scrapperRun: ScrapperRun, argv?: any): Promise<any>;
}