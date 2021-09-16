import Scrapper from "./Scrapper";
import { ScrapperOptions } from "./models/ScrapperOptions";
import { logger, stopLogger } from '../Logging';
import { ScrapperResult } from "./models/ScrapperResult";
import * as CompositionRoot from '../CompositionRoot';


export async function start(argv: any): Promise<ScrapperResult> {
    const debug = argv.debug as boolean
    if (debug) {
        process.env['DEBUG'] = "true"
    }
    const opt = {
        type: argv.type as string,
        runConfigurationId: typeof argv.runConfigurationId == 'string' ? argv.runConfigurationId : (argv.runConfigurationId as Number).toString(),
        debug: debug
    } as ScrapperOptions
    let scrapper = new Scrapper(opt, CompositionRoot.resultUploadService, CompositionRoot.scrapperDescriptorRead, argv);
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