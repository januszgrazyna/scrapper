import Scrapper from "./Scrapper";
import { ScrapperOptions } from "./ScrapperOptions";
import { logger, stopLogger } from '../Logging';
import { FirebaseRunUpload } from "../runUpload/impl/FirebaseRunUpload";
import { ScrapperRun } from "./ScrapperRun";


export async function start(opt: ScrapperOptions = new ScrapperOptions(), argv: any): Promise<ScrapperRun> {
    let scrapper = new Scrapper(opt, new FirebaseRunUpload(), argv);
    try {
        return await scrapper.start();        
    } catch (error) {
        logger.error(`Unexepected error raised while running scrapper: ${error}`)
        logger.error(`${error.stack}`)
        throw error
    }
}