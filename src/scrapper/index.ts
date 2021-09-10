import Scrapper from "./Scrapper";
import { ScrapperOptions } from "./models/ScrapperOptions";
import { logger, stopLogger } from '../Logging';
import { ScrapperResult } from "./models/ScrapperRun";
import * as CompositionRoot from '../CompositionRoot';


export async function start(opt: ScrapperOptions = new ScrapperOptions(), argv: any): Promise<ScrapperResult> {
    let scrapper = new Scrapper(opt, CompositionRoot.resultUploadService, argv);
    try {
        return await scrapper.start();        
    } catch (error) {
        logger.error(`Unexepected error raised while running scrapper: ${error}`)
        // @ts-ignore
        logger.error(`${error.stack}`)
        stopLogger()
        throw error
    }
}