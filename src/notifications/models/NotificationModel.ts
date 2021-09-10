import { v4 as uuidv4 } from 'uuid';
import { ScrapperRunId } from '../../scrapper/models/ScrapperResult';


export class NotificationModel {
    private _id: string;
    private _dateCreated: Date;
    private _notificationIdentifier: string = null!;

    title: string;
    body: string;
    options?: string;

    static fromLiteral(obj: Partial<NotificationModel>): NotificationModel {
        const newObj = new NotificationModel(obj.scrapperRunId!, obj.title!, obj.body!);
        const o = Object.assign(newObj, obj);
        return o;
    }

    constructor(
        public scrapperRunId: ScrapperRunId, title: string, body: string, public url: string | null = null
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

        if(!this.scrapperRunId){
            throw new Error("Scrapper run id null or undefined")
        }
    }

    get id(): string {
        return this._id;
    }

    get dateCreated(): Date {
        return this._dateCreated;
    }


    get notificationIdentifier(): string {
        return this._notificationIdentifier;
    }

    assignnotificationIdentifier(identifier: string) {
        if (this._notificationIdentifier != null) {
            throw new Error("Cannot set uniqueId twice");
        }

        this._notificationIdentifier = identifier;
    }


    static stringifiedOptions(options?: string): string {
        return options ? JSON.stringify(options) : "";
    }
}
