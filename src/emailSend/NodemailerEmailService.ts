import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import * as path from 'path';
import * as fs from 'fs';
import { IEmailService } from './IEmailService';


export class NodemailerEmailService implements IEmailService {
    private transport?: nodemailer.Transporter;

    constructor(private authFilepath: string, private authEnvVar: string){
    }

    private async loadSecrets(){
        const envVar = process.env[this.authEnvVar]
        if(envVar){
            return JSON.parse(envVar.toString()) 
        }
        const filepath = path.join(process.cwd(), this.authFilepath);
        if(fs.existsSync(filepath)){
            return JSON.parse(fs.readFileSync(filepath, "utf-8"))
        }else{
            throw new Error(`File ${filepath} not found`);
        }
    }

    private async tryInitMailtrapTransport() {
        if (!this.transport) {
            const mailtrapSecrets = await this.loadSecrets();
            this.transport = nodemailer.createTransport(mailtrapSecrets);
        }
    }

    async sendEmail(subject: string, msgText: string, msgHtml: string, recipients: string[]): Promise<any> {
        await this.tryInitMailtrapTransport();
        const mailOptions: Mail.Options = {
            from: 'ScrapperTest',
            to: recipients.join(", "),
            subject: subject,
            text: msgText,
            html: msgHtml,
        };
        return this.transport!.sendMail(mailOptions);
    }

}
