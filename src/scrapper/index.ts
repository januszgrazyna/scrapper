import Scrapper from "./Scrapper";
import { ScrapperOptions } from "./ScrapperOptions";
import { logger, stopLogger } from '../Logging';
import { FirebaseResultsUpload } from "../outputUpload/FirebaseResultsUpload";


export async function start(opt: ScrapperOptions = new ScrapperOptions(), argv: any) {
    let scrapper = new Scrapper(opt, new FirebaseResultsUpload(), argv)
    try {
        await scrapper.start();        
    } catch (error) {
        logger.error(`Error raised while running scrapper: ${error}`)
        logger.error(`${error.stack}`)
    }
    stopLogger();
}