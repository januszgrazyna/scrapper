import { ScrapperImplId } from '../../scrapper/ScrapperImplBase';
import { v4 as uuidv4 } from 'uuid';
import { ScrapperResultId } from '../../scrapper/models/ScrapperResult';


export class NotificationModel {
    private _id: string;
    private _dateCreated: Date;

    title: string;
    body: string;
    options?: string;

    static fromLiteral(obj: Partial<NotificationModel>): NotificationModel {
        const newObj = new NotificationModel(obj.notificationIdentifier!, obj.scrapperImplId!, obj.scrapperResultId!, obj.title!, obj.body!);
        const o = Object.assign(newObj, obj);
        return o;
    }

    constructor(
        public readonly notificationIdentifier: string,
        public readonly scrapperImplId: ScrapperImplId,
        public readonly scrapperResultId: ScrapperResultId, title: string, body: string, public url: string | null = null
    ) {
        this._dateCreated = new Date();
        this._id = uuidv4();
        if(!title){
            throw new Error("Title cannot be undefined/null")
        }
        this.title = title;
        if(!body){
            throw new Error("Body cannot be undefined/null")
        }
        this.body = body;

        if(!this.scrapperResultId){
            throw new Error("Scrapper run id null or undefined")
        }
    }

    get id(): string {
        return this._id;
    }

    get dateCreated(): Date {
        return this._dateCreated;
    }

    static stringifiedOptions(options?: string): string {
        return options ? JSON.stringify(options) : "";
    }
}
