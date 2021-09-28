export interface IEmailService {
    sendEmail(subject: string, msgText: string, msgHtml: string, recipients: string[]): Promise<any>;
}


export class GenericEmailServiceValidationDecorator implements IEmailService {

    constructor(private emailService: IEmailService){}

    sendEmail(subject: string, msgText: string, msgHtml: string, recipients: string[]) {
        if(subject.length == 0){
            throw new Error("Passed empty subject to sendEmail");
        }
        if(msgText.length == 0){
            throw new Error("Passed empty msgText to sendEmail");
        }
        if(msgText.length == 0){
            throw new Error("Passed empty msgHtml to sendEmail");
        }
        if(recipients.length == 0){
            throw new Error("Empty recipients array");
        }
        return this.emailService.sendEmail(subject, msgText, msgHtml, recipients);
    }

}

