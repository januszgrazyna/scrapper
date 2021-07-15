import { logger, configureScrapperLogger, stopLogger } from '../Logging';
import { ScrapperImpl } from './ScrapperImpl';
import { FirebaseNotificationSender } from '../notifications/impl/FirebaseNotificationSender';
import NotificationsFacade from '../notifications/NotificationsFacade';
import { FirestoreNotificationsStorageService } from '../notifications/impl/FirestoreNotificationsStorageService';
import { ScrapperImplLoader } from './ScrapperImplLoader';
import { ScrapperOptions } from './ScrapperOptions';
import * as fs from "fs";
import * as path from "path";
import { IResultsUpload } from '../outputUpload/IResultsUpload';
import { ScrapperRun } from './ScrapperRun';



export default class Scrapper {
    private scrapperImplLoader: ScrapperImplLoader = new ScrapperImplLoader();
    private outputDir?: string;

    constructor(
        private options: ScrapperOptions,
        private resultsUpload: IResultsUpload,
        private argv?: any,
    ) {}

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
      const dir = this.outputDir = path.join(process.cwd(), "outputs", scrapperRun.id);
      fs.mkdirSync(dir)
      process.chdir(dir)
      logger.info(`Scraper ${scrapperType} starting in ${dir}`)
    }

    async start() {
      configureScrapperLogger(this.options.type, this.options.debug);
      const impl = await this.loadImpl();
      const scrapperRun = new ScrapperRun(impl)
      this.setOutputDir(impl.implId, scrapperRun);
      logger.info(`Scrapper ${impl.implId} starting in ${this.outputDir} directory`)
      const results = await impl.start(new NotificationsFacade(
        new FirebaseNotificationSender(),
        new FirestoreNotificationsStorageService(),
        impl.notificationIdentifierFactory,
      ), scrapperRun, this.argv);
      scrapperRun.results = results;
      scrapperRun.outputDirectory = this.outputDir!;
      scrapperRun.ensureValid();

      logger.on('finish', async () => {
        setTimeout(async () => await this.resultsUpload.uploadResults(scrapperRun), 5000)
      })
      stopLogger()

    }

    async stop() {

    }
}
