import {MailtrapEmailService} from '../src/emailSend/MailtrapEmailService';

jest.setTimeout(30000);

test('', async () => {
    const emailService = new MailtrapEmailService();

    await emailService.sendEmail('Test', 'Scrapper test', '<b>Scrapper test</b>', ['test@gmail.com'])
})