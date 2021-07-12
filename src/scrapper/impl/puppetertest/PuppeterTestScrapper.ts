import { parseScrapperOptions, ScrapperImpl } from "../ScrapperImpl";
import { logger } from '../../../Logging';
//import * as p from 'puppeteer';
import { Page, HTTPResponse, LaunchOptions } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import { NotificationModel } from "../../../notifications/NotificationModel";
import NotificationsFacade from "../../../notifications/NotificationsFacade";
import HumanizePlugin from '@extra/humanize';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';


export class PuppeterTestScrapper extends ScrapperImpl {
    private notificationsFacade?: NotificationsFacade;

    constructor() {
        super("PuppeterTest");
    }

    private async startScrapping() {
        logger.debug("PuppeterTest scrapper is starting");
        
        let plug = StealthPlugin()
        console.log(plug.availableEvasions)
        puppeteer.use(plug);
        const browser = await puppeteer.launch({ headless: false, args: [
            '--no-sandbox',
            '--disable-setuid-sandbox',
            '--disable-infobars',
            '--window-position=0,0',
            '--ignore-certifcate-errors',
            '--ignore-certifcate-errors-spki-list'
        ] } as LaunchOptions);
        HumanizePlugin({
            mouse: { showCursor: true, enabled: true }
        }).enable();
        const page = (await browser.pages())[0];
        page.setViewport({ width: 1900, height: 2000 });
        await page.goto("http://127.0.0.1:8080/index.html")
    }

    async start(notificationsFacade: NotificationsFacade, argv?: any): Promise<any> {
        this.notificationsFacade = notificationsFacade;
        await this.startScrapping();
    }

    notificationIdentifierFactory(model: NotificationModel): string {
        return `[Test]${model.title}${model.url}${model.body}`;
    }
}
