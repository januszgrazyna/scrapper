import {NodemailerEmailService} from '../src/emailSend/NodemailerEmailService';
import * as path from 'path';

jest.setTimeout(30000);

test('', async () => {
    const emailService = new NodemailerEmailService(path.join('src', 'dev', 'mailtrapSecrets.json'), "MAILTRAP_AUTH");

    await emailService.sendEmail('Test', 'Scrapper test', '<b>Scrapper test</b>', ['test@gmail.com'])
})