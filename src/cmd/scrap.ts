import yargs from "yargs";
import Scrapper from "../scrapper/Scrapper";
import { ClientOptions, DEFAULT_headless, DEFAULT_mitmProxyRemoveResult, DEFAULT_useMitmProxy } from "../scrapper/models/ClientOptions";
import { logger, stopLogger } from '../Logging';
import * as CompositionRoot from '../CompositionRoot';
import { _configureEnvironment } from "../environment";
import { exit } from "process";

export function addScrapCommand(yargs: yargs.Argv<{}>): yargs.Argv<{}> {
    return yargs.command('scrap <type>', 'Start scrapper. Scrapper implementation options are acessible gy providing arguments in form --<arg prefix>-<option name>=<option value>', (yargs) => {
        yargs
          .positional('type', {
            describe: 'scrapper type',
            type: 'string',
          })
          .option('labels', {
            describe: 'Labels in json format that will be added to results.',
            type: 'string',
          })
          .option('proxyAddr', {
            describe: 'proxy address',
            type: 'string',
          })
          .option('useMitmProxy', {
            describe: 'Use mitmproxy at http://localhost:8080 to intercept traffic. Overrides proxyAddr',
            type: 'boolean',
            default: DEFAULT_useMitmProxy
          })
          .option('mitmProxyRemoveResult', {
            describe: 'remove result file of mitmproxy',
            type: 'boolean',
            default: DEFAULT_mitmProxyRemoveResult
          })
          .option('headless', {
            describe: 'headless mode',
            type: 'boolean',
            default: DEFAULT_headless
          })
          .option('debug', {
            describe: 'debug',
            default: false,
            type: 'boolean',
          })
          .help()
      }, async (argv) => {
        await scrap(argv);
      })
}



async function scrap(argv: any): Promise<void> {
    _configureEnvironment(argv.debug as boolean);
    const opt = new ClientOptions(
        argv.type,
        argv.runConfigurationId,
    )
    if(argv.proxyAddr) opt.proxyAddr = argv.proxyAddr
    if(argv.headless) opt.headless = argv.headless
    if(argv.useMitmProxy) opt.useMitmProxy = argv.useMitmProxy
    if(argv.mitmProxyRemoveResult) opt.mitmProxyRemoveResult = argv.mitmProxyRemoveResult

    if(argv.labels){
      console.log(`Parsing labels argument: ${argv.labels}`)
      const labels = JSON.parse(argv.labels);
      opt.labels = labels;
    }

    let scrapper = new Scrapper(CompositionRoot.resultUploadService, CompositionRoot.scrapperDescriptorRead);
    try {
        const result = await scrapper.start(opt, argv);
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