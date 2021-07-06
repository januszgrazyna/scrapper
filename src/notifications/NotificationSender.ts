import { v4 as uuidv4 } from 'uuid';

export class NotificationModel {
    private _id: string;
    private _dateCreated: Date;
    private _notificationIdentifier: string = null!;
    
    title: string = null!;
    body: string = null!;
    url?: string;
    options?: string;

    static fromLiteral(obj: Partial<NotificationModel>): NotificationModel{
        const newObj = new NotificationModel();
        const o = Object.assign(newObj, obj);
        return o;
    }

    constructor() {
        this._dateCreated = new Date();
        this._id = uuidv4();
    }

    get id(): string {
        return this._id;
    }

    get dateCreated(): Date {
        return this._dateCreated;
    }

    
    get notificationIdentifier() : string {
        return this._notificationIdentifier;
    }

    assignnotificationIdentifier(identifier: string){
        if(this._notificationIdentifier != null){
            throw new Error("Cannot set uniqueId twice");
        }

        this._notificationIdentifier = identifier;
    }
    

    static stringifiedOptions(options?: string): string {
        return options ? JSON.stringify(options) : "";
    }
}

export interface INotificationSender {
    sendNotification(notification: NotificationModel): Promise<any>;
}

