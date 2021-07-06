import { parseScrapperOptions, ScrapperImpl } from "./ScrapperImpl";
import { logger } from '../../Logging';
import * as p from 'puppeteer'
import puppeteer from 'puppeteer-extra';
import { NotificationModel } from "../../notifications/NotificationSender";
import NotificationsFacade from "../../notifications/NotificationsFacade";
import HumanizePlugin from '@extra/humanize';
import StealthPlugin from 'puppeteer-extra-plugin-stealth';

interface AllegroItem {
    buyNow?: boolean;
    auction?: boolean;
    advert?: boolean;
    price?: number;
    priceStr?: string;
    title?: string;
    attributes?: { k: string, v: string }[];
    link?: string;
}

interface SearchOptions {
    categoryUrlString: string;
    searchTerm: string;
    notificationExpr: string;
    interval: number;
    page?: number;
    buyNow?: boolean;
    auction?: boolean;
    advert?: boolean;
    priceFrom?: number;
}


export class AllegroScrapper extends ScrapperImpl {
    private interval: any;
    private searchOptions?: SearchOptions;
    private notificationsFacade?: NotificationsFacade;

    constructor() {
        super("Allegro")
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
        logger.debug(`Opening page at ${link}`)
        return link;
    }

    enterItemsPage(opt: SearchOptions, page: p.Page, pageNumber: number): Promise<p.Response | null> {
        const link = this.buildAllegroLink(opt, pageNumber);
        return page.goto(link);
    }

    clickConsentButton(page: p.Page): Promise<void> {
        return page.click('button[data-role=accept-consent]');            
    }

    getTotalPages(page: p.Page): Promise<number> {
        return page.evaluate(() => {
            const totalArr = Array.from(document.querySelectorAll("div a[name='pagination-bottom']+div input")).map(v => v.attributes).filter(v => v.hasOwnProperty("data-maxpage")).map((v: NamedNodeMap) => v.getNamedItem("data-maxpage")?.value);
            if (totalArr.length > 0) {
                return Number.parseInt(totalArr[0]!);
            } else {
                throw new Error("cannot get total");
            }
        });
    }

    getAllegroItems(page: p.Page): Promise<AllegroItem[]> {
        return page.evaluate(() => {

            const items = [];
            for (const article of Array.from(document.querySelectorAll("div[data-box-name='items container'] article"))) {
                const item: AllegroItem = {};

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
                        item.price = Number.parseFloat(priceStr.replace(/,/g, ".").replace(/\s/g, ""))
                        item.priceStr = priceStr;
                        break;
                    }
                }

                items.push(item);
            }

            return items;
        });
    }

    private startScrapping() {
        const f = async () => {
            logger.debug("Allegro scrapper is starting");
            
            puppeteer.use(StealthPlugin())
            const browser = await puppeteer.launch({headless: true} as p.LaunchOptions);
            HumanizePlugin({
                mouse: {showCursor: true, enabled: true}
            }).enable()
            const page = await browser.newPage();
            page.setViewport({ width: 1900, height: 2000 });
            
            try {
                /* categoryUrlString: 'podzespoly-komputerowe-karty-graficzne-260019',
                searchTerm: "rtx 2060", */
                this.searchOptions!.page ??= 1;
                await this.enterItemsPage(this.searchOptions!, page, this.searchOptions!.page);
                await this.clickConsentButton(page);

                const totalPages = await this.getTotalPages(page);
                console.log("TOTAL PAGES: " + totalPages);

                let currentPage = this.searchOptions!.page;
                const maxPage = totalPages + 1;
                logger.debug(`Allegro scrapper will search on pages [${currentPage}, ${maxPage})`);

                while (currentPage != maxPage) {
                    if (this.searchOptions!.page != currentPage) {
                        await this.enterItemsPage(this.searchOptions!, page, currentPage);
                    }
                    const items = await this.getAllegroItems(page);

                    for (const item of items) {
                        if(eval(`(${this.searchOptions?.notificationExpr})`)){

                            const notification = new NotificationModel();
                            notification.title = '[Allegro] Found item with price: ' + item.price;
                            notification.body = item.title!;
                            notification.url = item.link!;

                            await this.notificationsFacade?.sendNotification(notification);
                        }
                    }

                    let itemsStrObj = items.map(v => ({ ...v, attributes: v.attributes?.map(v => `${v.k} ${v.v}`) }));
                    console.log(itemsStrObj);

                    currentPage++;
                }
            } catch (error) {
                logger.error(error)
                await page.screenshot({path: 'error.png'})
                return
            }

            await browser.close();
            logger.debug(`Allegro scrapper finished. Next run in ${this.searchOptions!.interval} ms`);
            this.interval = setTimeout(f, this.searchOptions!.interval);
        }
        return f();
    }

    async start(notificationsFacade: NotificationsFacade, argv?: any): Promise<void> {
        this.searchOptions = parseScrapperOptions<SearchOptions>("allegro", argv);
        this.notificationsFacade = notificationsFacade;
        await this.startScrapping();
    }

    notificationIdentifierFactory(model: NotificationModel): string {
        return `[Allegro]${model.title}${model.url}${model.body}`;
    }
}