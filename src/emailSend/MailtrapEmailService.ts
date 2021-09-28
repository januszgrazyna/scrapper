import * as nodemailer from 'nodemailer';
import Mail from 'nodemailer/lib/mailer';
import * as path from 'path';
import * as fs from 'fs';
import { IEmailService } from './IEmailService';


export class MailtrapEmailService implements IEmailService {
    private static readonly MailTrapAuthEnvVar = "MAILTRAP_AUTH";
    private transport?: nodemailer.Transporter;

    private async loadSecrets(){
        const filepath = path.join(process.cwd(), 'src', 'dev', 'mailtrapSecrets.json');
        if(fs.existsSync(filepath)){
          return JSON.parse(fs.readFileSync(filepath, "utf-8"))
        }
        const envVar = process.env[MailtrapEmailService.MailTrapAuthEnvVar]
        if(!envVar){
          throw new Error(`Cannot find ${MailtrapEmailService.MailTrapAuthEnvVar} variable`)
        }
        return JSON.parse(envVar.toString())
    }

    private async tryInitMailtrapTransport() {
        if (!this.transport) {
            const mailtrapSecrets = await this.loadSecrets();
            this.transport = nodemailer.createTransport({
                host: "smtp.mailtrap.io",
                port: 2525,
                auth: mailtrapSecrets.auth
            });
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
