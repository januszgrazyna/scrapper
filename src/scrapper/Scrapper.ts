import { logger, configureScrapperLogger, stopLogger } from '../Logging';
import { ScrapperImplBase } from './ScrapperImplBase';
import NotificationsFacade from '../notifications/NotificationsFacade';
import { ScrapperImplLoader } from './ScrapperImplLoader';
import { ScrapperOptions } from './models/ScrapperOptions';
import * as fs from "fs";
import * as path from "path";
import { IRunUploadService } from '../runUpload/IRunUploadService';
import { ScrapperResult } from './models/ScrapperRun';
import * as CompositionRoot from '../CompositionRoot';



export default class Scrapper {
    private scrapperImplLoader: ScrapperImplLoader = new ScrapperImplLoader();
    private outputDir?: string;

    constructor(
        private options: ScrapperOptions,
        private runUploadService: IRunUploadService,
        private argv?: any,
    ) {
      if(!options.runConfigurationId){
        throw new Error("Unknown RunConfigurationId");
      }
    }

    private async loadImpl(): Promise<ScrapperImplBase> {
      let impl: ScrapperImplBase;

      try {
        impl = await this.scrapperImplLoader.load(this.options.type);
        return impl;
      } catch (error) {
        logger.error(`Cannot load scrapper ${this.options.type}: ${error}`);
        throw error;
      }
    }

    
    private setOutputDir(scrapperType: string, scrapperRun: ScrapperResult){
      if(!fs.existsSync("outputs")){
          fs.mkdirSync("outputs");
      }
      const dir = this.outputDir = path.join("outputs", scrapperRun.id);
      fs.mkdirSync(dir)
      process.chdir(dir)
      logger.info(`Scraper ${scrapperType} starting in ${dir}`)
    }

    async start(): Promise<ScrapperResult> {
      configureScrapperLogger(this.options.type, this.options.debug);
      const impl = await this.loadImpl();
      const scrapperResult = new ScrapperResult(impl, this.options.runConfigurationId!)
      this.setOutputDir(impl.id, scrapperResult);
      logger.info(`Scrapper ${impl.id} starting in ${this.outputDir} directory`)

      try {
        logger.debug(`Adding new result with id ${scrapperResult.id}`)
        await this.runUploadService.add(scrapperResult)
        scrapperResult.outputDirectory = this.outputDir!;
        const results = await impl.start(new NotificationsFacade(
          CompositionRoot.notificationSenderService,
          CompositionRoot.notificationsStorageService,
          impl.notificationIdentifierFactory,
        ), scrapperResult, this.argv);
        scrapperResult.results = results;
        scrapperResult.setFinished()
      } catch (error) {
        scrapperResult.setFailed()
        logger.error(`Error raised while running scrapper ${impl.id}: ${error}`)
        // @ts-ignore
        logger.error(`${error.stack}`)
      }
      finally{
        logger.on('finish', async () => {
          setTimeout(async () => await this.runUploadService.updateAndSendResults(scrapperResult), 5000)
        })
      }
      return scrapperResult;
    }

    async stop() {

    }
}
