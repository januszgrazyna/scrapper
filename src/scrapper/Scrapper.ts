import { logger, configureScrapperLogger, stopLogger } from '../Logging';
import { ScrapperImpl } from './impl/ScrapperImpl';
import { FirebaseNotificationSender } from '../notifications/impl/FirebaseNotificationSender';
import NotificationsFacade from '../notifications/NotificationsFacade';
import { FirestoreNotificationsStorageService } from '../notifications/impl/FirestoreNotificationsStorageService';
import { ScrapperImplLoader } from './ScrapperImplLoader';
import { ScrapperOptions } from './ScrapperOptions';
import * as fs from "fs";
import * as path from "path";
import { IOutputUpload } from '../outputUpload/IOutputUpload';



export default class Scrapper {
    private scrapperImplLoader: ScrapperImplLoader = new ScrapperImplLoader();
    private outputDir?: string;

    constructor(
        private options: ScrapperOptions,
        private outputUpload: IOutputUpload,
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

    
    private setOutputDir(scrapperType: string){
      if(!fs.existsSync("outputs")){
          fs.mkdirSync("outputs");
      }
      const now = new Date();
      const dir = this.outputDir = path.join(process.cwd(), "outputs",`${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`);
      fs.mkdirSync(dir)
      process.chdir(dir)
      logger.info(`Scraper ${scrapperType} starting in ${dir}`)
    }

    async start() {
      configureScrapperLogger(this.options.type, this.options.debug);
      const impl = await this.loadImpl();
      this.setOutputDir(impl.scrapperType);
      logger.info(`Scrapper ${impl.scrapperType} starting in ${this.outputDir} directory`)
      await impl.start(new NotificationsFacade(
        new FirebaseNotificationSender(),
        new FirestoreNotificationsStorageService(),
        impl.notificationIdentifierFactory,
      ),
      this.argv);
      logger.on('finish', async () => {
        setTimeout(async () => await this.outputUpload.uploadOutputFolder(this.outputDir!), 5000)
      })
      stopLogger()

    }

    async stop() {

    }
}
