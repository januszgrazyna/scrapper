import { logger, configureScrapperLogger } from '../Logging';
import { ScrapperImpl } from './impl/ScrapperImpl';
import { FirebaseNotificationSender } from '../notifications/impl/FirebaseNotificationSender';
import NotificationsFacade from '../notifications/NotificationsFacade';
import { FirestoreNotificationsStorageService } from '../notifications/impl/FirestoreNotificationsStorageService';
import { ScrapperImplLoader } from './ScrapperImplLoader';
import { ScrapperOptions } from './ScrapperOptions';
import * as fs from "fs";
import * as path from "path";



export default class Scrapper {
    private scrapperImplLoader: ScrapperImplLoader = new ScrapperImplLoader();

    constructor(
        private options: ScrapperOptions,
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
      const dir = path.join("outputs",`${now.getDay()}_${now.getMonth()}_${now.getFullYear()}__${now.getHours()}_${now.getMinutes()}_${now.getSeconds()}`);
      fs.mkdirSync(dir)
      process.chdir(dir)
      logger.info(`Scraper ${scrapperType} starting in ${dir}`)
    }

    async start() {
      const impl = await this.loadImpl();
      configureScrapperLogger(impl.scrapperType, this.options.debug);
      this.setOutputDir(impl.scrapperType);
      await impl.start(new NotificationsFacade(
        new FirebaseNotificationSender(),
        new FirestoreNotificationsStorageService(),
        impl.notificationIdentifierFactory,
      ),
      this.argv);
    }

    async stop() {

    }
}
