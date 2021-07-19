import { parseScrapperOptions, ScrapperImpl } from "../../ScrapperImpl";
import { logger } from '../../../Logging';
import { Page, HTTPResponse, LaunchOptions } from 'puppeteer';
import puppeteer from 'puppeteer-extra';
import { NotificationModel } from "../../../notifications/NotificationModel";
import NotificationsFacade from "../../../notifications/NotificationsFacade";
import HumanizePlugin from '@extra/humanize';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';
import { Item } from "./Item";
import { SearchOptions } from "./SearchOptions";
import { sleep } from "../../../utils";
import { ScrapperRun } from "../../ScrapperRun";


export class AllegroScrapper extends ScrapperImpl {
    private interval: any;
    private searchOptions?: SearchOptions;
    private notificationsFacade?: NotificationsFacade;
    private scrapperRun?: ScrapperRun;

    constructor() {
        super("Allegro");
    }

    buildAllegroLink(opt: SearchOptions, pageNumber: number): string {
        if (!opt.categoryUrlString || opt.categoryUrlString.length == 0) {
            throw new Error("invalid category url string");
        }
        if (pageNumber <= 0) {
            throw new Error("invalid page number");
        }

        let link = `https://allegro.pl/kategoria/${opt.categoryUrlString}?string=${encodeURI(opt.searchTerm)}`;

        if (opt.priceFrom && opt.priceFrom > 0) {
            link += `&price_from=${opt.priceFrom}`;
        }

        if (opt.auction) {
            link += `$offerTypeAuction=2`;
        }
        if (opt.buyNow) {
            link += `$offerTypeBuyNow=1`;
        }
        if (opt.advert) {
            link += `$offerTypeAdvert=3`;
        }

        link += `&p=${pageNumber}`;
        // TODO: optional?
        link += `&order=p` //list items in decreasing price order
        logger.debug(`Opening page at ${link}`);
        return link;
    }

    enterItemsPage(opt: SearchOptions, page: Page, pageNumber: number): Promise<HTTPResponse | null> {
        const link = this.buildAllegroLink(opt, pageNumber);
        return page.goto(link);
    }

    clickConsentButton(page: Page): Promise<void> {
        logger.debug('Clicking consent')
        return page.click('button[data-role=accept-consent]');
    }

    getTotalPages(page: Page): Promise<number> {
        return page.evaluate(() => {
            const totalArr = Array.from(document.querySelectorAll("div a[name='pagination-bottom']+div input")).map(v => v.attributes).filter(v => v.hasOwnProperty("data-maxpage")).map((v: NamedNodeMap) => v.getNamedItem("data-maxpage")?.value);
            if (totalArr.length > 0) {
                return Number.parseInt(totalArr[0]!);
            } else {
                throw new Error("cannot get total");
            }
        });
    }

    getAllegroItems(page: Page): Promise<Item[]> {
        return page.evaluate(() => {

            const items = [];
            for (const article of Array.from(document.querySelectorAll("div[data-box-name='items container'] article"))) {
                const item: Item = {};

                item.auction = article.textContent?.indexOf("LICYTACJA") != -1;
                item.advert = article.textContent?.indexOf("OGŁOSZENIE") != -1;
                item.buyNow = !item.auction && !item.advert;

                const title = article.querySelector("h2")?.textContent;
                if (title == null) {
                    throw Error("null title");
                }
                item.title = title;

                item.link = article.querySelector("h2 a")?.attributes.getNamedItem("href")?.value;

                const dl = article.querySelector("dl");
                if (dl) {
                    // @ts-ignore
                    item.attributes = Array.from(dl.children).map((r, i) => (i % 2 == 0 ? { k: r.textContent!, v: dl.children[i + 1].textContent! } : null)).filter(v => v != null);
                }

                const prices = Array.from(article.querySelectorAll("span"))
                    .map(v => v.textContent ?? "")
                    .filter(v => v.length > 0 && v.indexOf("zł") != -1)
                    .sort((a, b) => a.length > b.length ? -1 : 1);

                for (const priceStr of prices) {
                    if (priceStr.match(/^[\d|,|\s]+zł$/)) {
                        item.price = Number.parseFloat(priceStr.replace(/,/g, ".").replace(/\s/g, ""));
                        item.priceStr = priceStr;
                        break;
                    }
                }

                items.push(item);
            }

            return items;
        });
    }

    private async randomSleep(){
        const randomSleep = Math.floor(Math.random() * 10000) + 3500
        logger.debug(`Starting random sleep for ${randomSleep} ms`)
        await sleep(randomSleep)
    }

    private async startScrapping() {
        let totalItems: Item[] = []
        let repeatCount = 0;
        const f = async () => {
            logger.debug("Allegro scrapper is starting");

            puppeteer.use(StealthPlugin());
            const browserArgs = [
                '--no-sandbox',
                '--disable-setuid-sandbox',
                '--disable-infobars',
                '--window-position=0,0',
                '--ignore-certifcate-errors',
                '--ignore-certifcate-errors-spki-list'
            ]
            if(this.searchOptions!.proxyAddr){
                logger.debug(`Setting proxy server to ${this.searchOptions!.proxyAddr}`)
                browserArgs.push(`--proxy-server=${this.searchOptions!.proxyAddr}`)
            }
            const browser = await puppeteer.launch({ headless: false, args: browserArgs } as LaunchOptions);
            HumanizePlugin({
                mouse: { showCursor: true, enabled: true }
            }).enable();
            const page = (await browser.pages())[0];
            page.setViewport({ width: 1366, height: 768 });
            
            const notificationsToSend: NotificationModel[] = []
            try {
                /* categoryUrlString: 'podzespoly-komputerowe-karty-graficzne-260019',
                searchTerm: "rtx 2060", */
                this.searchOptions!.page ??= 1;
                await this.enterItemsPage(this.searchOptions!, page, this.searchOptions!.page);
                await this.randomSleep()
                await this.clickConsentButton(page);

                const totalPages = await this.getTotalPages(page);
                logger.info(`total pages: ${totalPages}`);
                this.searchOptions!.maxPage ??= totalPages

                let currentPage = this.searchOptions!.page;
                const maxPage = this.searchOptions!.maxPage + 1;
                logger.debug(`Allegro scrapper will search on pages [${currentPage}, ${maxPage})`);

                while (currentPage != maxPage) {
                    if (this.searchOptions!.page != currentPage) {
                        await this.randomSleep()
                        await this.enterItemsPage(this.searchOptions!, page, currentPage);
                    }
                    const items = await this.getAllegroItems(page);
                    
                    for (const item of items) {
                        if (eval(`(${this.searchOptions?.notificationExpr})`)) {
                            const title = '[Allegro] Found item with price: ' + item.price;
                            const body = item.title!;
                            const notification = new NotificationModel(this.scrapperRun?.id!, title, body);

                            notification.url = item.link!;
                            notificationsToSend.push(notification)
                        }
                    }

                    let itemsStrAttr = items.map(v => ({ ...v, attributes: v.attributes?.map(v => `${v.k} ${v.v}`) }));
                    //console.log(itemsStrAttr);
                    totalItems = totalItems.concat(items)

                    currentPage++;
                }
            } catch (error) {
                logger.error(error);
                await page.screenshot({ path: 'error.png' });
                await browser.close();
                return;
            }
            finally{
                await this.notificationsFacade?.sendNotifications(notificationsToSend);
            }

            await browser.close();
            repeatCount++;
            if(this.searchOptions!.interval && (this.searchOptions?.maxRepeat ?? -1) != repeatCount){
                logger.debug(`Allegro scrapper finished #${repeatCount}. Next run in ${this.searchOptions!.interval} ms`);
                this.interval = setTimeout(f, this.searchOptions!.interval);
            }else{
                logger.debug(`Allegro scrapper finished`);
            }
        };
        await f();
        logger.info(`Processed ${totalItems.length} items`)
    }

    async start(notificationsFacade: NotificationsFacade, scrapperRun: ScrapperRun, argv?: any): Promise<void> {
        this.searchOptions = parseScrapperOptions<SearchOptions>("allegro", argv);
        this.notificationsFacade = notificationsFacade;
        this.scrapperRun = scrapperRun;
        await this.startScrapping();
    }

    notificationIdentifierFactory(model: NotificationModel): string {
        return `[Allegro]${model.title}${model.url}${model.body}`;
    }
}
