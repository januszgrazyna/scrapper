import Scrapper from "./Scrapper";
import { ScrapperOptions } from "./models/ScrapperOptions";
import { logger, stopLogger } from '../Logging';
import { ScrapperRun } from "./models/ScrapperRun";
import * as CompositionRoot from '../CompositionRoot';


export async function start(opt: ScrapperOptions = new ScrapperOptions(), argv: any): Promise<ScrapperRun> {
    let scrapper = new Scrapper(opt, CompositionRoot.runUploadService, argv);
    try {
        return await scrapper.start();        
    } catch (error) {
        logger.error(`Unexepected error raised while running scrapper: ${error}`)
        logger.error(`${error.stack}`)
        throw error
    }
    finally{
        stopLogger()
    }
}