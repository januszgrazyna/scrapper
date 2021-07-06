import Scrapper from "./Scrapper";
import { ScrapperOptions } from "./ScrapperOptions";
import { stopLogger } from '../Logging';


export async function start(opt: ScrapperOptions = new ScrapperOptions(), argv: any) {
    let scrapper = new Scrapper(opt, argv)
    await scrapper.start();
    stopLogger();
}