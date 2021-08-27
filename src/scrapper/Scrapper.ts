import { logger, configureScrapperLogger, stopLogger } from '../Logging';
import { ScrapperImpl } from './ScrapperImpl';
import NotificationsFacade from '../notifications/NotificationsFacade';
import { ScrapperImplLoader } from './ScrapperImplLoader';
import { ScrapperOptions } from './models/ScrapperOptions';
import * as fs from "fs";
import * as path from "path";
import { IRunUploadService } from '../runUpload/IRunUploadService';
import { ScrapperRun } from './models/ScrapperRun';
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

    private async loadImpl(): Promise<ScrapperImpl> {
      let impl: ScrapperImpl;

      try {
        impl = await this.scrapperImplLoader.load(this.options.type);
        return impl;
      } catch (error) {
        logger.error(`Cannot load scrapper ${this.options.type}: ${error}`);
        throw error;
      }
    }

    
    private setOutputDir(scrapperType: string, scrapperRun: ScrapperRun){
      if(!fs.existsSync("outputs")){
          fs.mkdirSync("outputs");
      }
      const dir = this.outputDir = path.join("outputs", scrapperRun.id);
      fs.mkdirSync(dir)
      process.chdir(dir)
      logger.info(`Scraper ${scrapperType} starting in ${dir}`)
    }

    async start(): Promise<ScrapperRun> {
      configureScrapperLogger(this.options.type, this.options.debug);
      const impl = await this.loadImpl();
      const scrapperRun = new ScrapperRun(impl, this.options.runConfigurationId!)
      this.setOutputDir(impl.id, scrapperRun);
      logger.info(`Scrapper ${impl.id} starting in ${this.outputDir} directory`)

      try {
        logger.debug(`Adding new run with id ${scrapperRun.id}`)
        await this.runUploadService.add(scrapperRun)
        scrapperRun.outputDirectory = this.outputDir!;
        const results = await impl.start(new NotificationsFacade(
          CompositionRoot.notificationSenderService,
          CompositionRoot.notificationsStorageService,
          impl.notificationIdentifierFactory,
        ), scrapperRun, this.argv);
        scrapperRun.results = results;
        scrapperRun.setFinished()
      } catch (error) {
        scrapperRun.setFailed()
        logger.error(`Error raised while running scrapper ${impl.id}: ${error}`)
        logger.error(`${error.stack}`)
      }
      finally{
        logger.on('finish', async () => {
          setTimeout(async () => await this.runUploadService.updateAndSendResults(scrapperRun), 5000)
        })
      }
      return scrapperRun;
    }

    async stop() {

    }
}
