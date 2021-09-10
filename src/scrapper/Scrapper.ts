import { logger, configureScrapperLogger, stopLogger } from '../Logging';
import { ScrapperImplBase } from './ScrapperImplBase';
import NotificationsFacade from '../notifications/NotificationsFacade';
import { ScrapperImplLoader } from './ScrapperImplLoader';
import { ScrapperOptions } from './models/ScrapperOptions';
import * as fs from "fs";
import * as path from "path";
import { IResultUploadService } from '../resultUpload/IResultUploadService';
import { ScrapperResult } from './models/ScrapperResult';
import * as CompositionRoot from '../CompositionRoot';



export default class Scrapper {
    private scrapperImplLoader: ScrapperImplLoader = new ScrapperImplLoader();
    private outputDir?: string;

    constructor(
        private options: ScrapperOptions,
        private resultUploadService: IResultUploadService,
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
        await this.resultUploadService.add(scrapperResult)
        scrapperResult.outputDirectory = this.outputDir!;
        await impl.start(new NotificationsFacade(
          CompositionRoot.notificationSenderService,
          CompositionRoot.notificationsStorageService,
          impl.notificationIdentifierFactory,
        ), scrapperResult, this.options.debug, this.argv);
        scrapperResult.setFinished()
        logger.info('Scrapper succesfully finished')
      } catch (error) {
        scrapperResult.setFailed()
        logger.error(`Error raised while running scrapper ${impl.id}: ${error}`)
        // @ts-ignore
        logger.error(`${error.stack}`)
      }
      finally{
        await this.resultUploadService.updateResults(scrapperResult);
        this.sendOutputs(scrapperResult)
      }
      return scrapperResult;
    }

    private sendOutputs(scrapperResult: ScrapperResult) {
      logger.on('finish', async () => {
        setTimeout(async () => await this.resultUploadService.sendOutputs(scrapperResult), 5000)
      })
      logger.debug(`Sending files from ${process.cwd()} into ${scrapperResult.outputDirectory!}`)
      stopLogger()
    }

    async stop() {

    }
}
