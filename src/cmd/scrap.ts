import yargs from "yargs";
import Scrapper from "../scrapper/Scrapper";
import { CliOptions } from "../scrapper/models/CliOptions";
import { logger, stopLogger } from '../Logging';
import * as CompositionRoot from '../CompositionRoot';
import { _configureEnvironment, debug } from "../environment";
import { exit } from "process";

export function addScrapCommand(yargs: yargs.Argv<{}>): yargs.Argv<{}> {
    return yargs.command('scrap <type> <runConfigurationId>', 'start scrapper', (yargs) => {
        yargs
          .positional('type', {
            describe: 'scrapper type',
          })
          .positional('runConfigurationId', {
            describe: 'runConfiguration id',
          })
          .option('debug', {
            describe: 'debug',
            default: false,
          })
          .help()
      }, async (argv) => {
        await scrap(argv);
      })
}

async function scrap(argv: any): Promise<void> {
    _configureEnvironment(argv.debug as boolean);
    const opt = {
        type: argv.type as string,
        runConfigurationId: typeof argv.runConfigurationId == 'string' ? argv.runConfigurationId : (argv.runConfigurationId as Number).toString(),
        proxyAddr: argv.proxyAddr,
        mitmProxySave: argv.mitmProxySave ? argv.mitmProxySave === "true" : false,
        mitmProxySendResult: argv.mitmProxySendResult ? argv.mitmProxySendResult === "true" : false,
        headless: argv.headless ? argv.headless === "true" : true
    } as CliOptions
    if(debug && opt.headless && !argv.headless){
        opt.headless = false;
    }

    let scrapper = new Scrapper(opt, CompositionRoot.resultUploadService, CompositionRoot.scrapperDescriptorRead, argv);
    try {
        const result = await scrapper.start();
        if(result.status == "failed"){
            exit(1)
        }
    } catch (error) {
        logger.error(`Unexepected error raised while running scrapper: ${error}`)
        // @ts-ignore
        logger.error(`${error.stack}`)
        stopLogger()
        throw error
    }
}