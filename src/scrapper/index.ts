import Scrapper from "./Scrapper";
import { ScrapperOptions } from "./ScrapperOptions";
import { logger, stopLogger } from '../Logging';
import { FirebaseRunUpload } from "../runUpload/impl/FirebaseRunUpload";


export async function start(opt: ScrapperOptions = new ScrapperOptions(), argv: any) {
    let scrapper = new Scrapper(opt, new FirebaseRunUpload(), argv)
    try {
        await scrapper.start();        
    } catch (error) {
        logger.error(`Error raised while running scrapper: ${error}`)
        logger.error(`${error.stack}`)
    }
    stopLogger();
}