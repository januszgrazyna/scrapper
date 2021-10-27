import Scrapper from "./Scrapper";
import { ScrapperOptions } from "./models/ScrapperOptions";
import { logger, stopLogger } from '../Logging';
import { ScrapperResult } from "./models/ScrapperResult";
import * as CompositionRoot from '../CompositionRoot';
import { _configureEnvironment } from "../environment";


export async function start(argv: any): Promise<ScrapperResult> {
    _configureEnvironment(argv.debug as boolean);
    const opt = {
        type: argv.type as string,
        runConfigurationId: typeof argv.runConfigurationId == 'string' ? argv.runConfigurationId : (argv.runConfigurationId as Number).toString(),
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