import { logger, configureScrapperLogger, stopLogger } from '../Logging';
import { ScrapperImplBase, ScrapperImplId } from './ScrapperImplBase';
import NotificationsFacade from '../notifications/NotificationsFacade';
import { LocalScrapperImplLoader } from './LocalScrapperImplLoader';
import { ScrapperOptions } from './models/ScrapperOptions';
import * as fs from "fs";
import * as path from "path";
import { IResultUploadService } from '../resultUpload/IResultUploadService';
import { ScrapperResult } from './models/ScrapperResult';
import * as CompositionRoot from '../CompositionRoot';
import { IScrapperDescriptorRead } from './IScrapperDescriptorRead';
import { ScrapperDescriptor } from './models/ScrapperDescriptor';



export default class Scrapper {
    private outputDir?: string;
    private scrapperImplLoader = new LocalScrapperImplLoader();

    constructor(
        private options: ScrapperOptions,
        private resultUploadService: IResultUploadService,
        private scrapperDescriptorRead: IScrapperDescriptorRead,
        private argv?: any,
    ) {
      if(!options.runConfigurationId){
        throw new Error("Unknown RunConfigurationId");
      }
    }

    private async loadImpl(): Promise<ScrapperImplBase> {
      let impl: ScrapperImplBase;
      const scrapperImplId = this.options.type as ScrapperImplId;
      let descriptor = await this.scrapperDescriptorRead.getScrapperDescriptor(scrapperImplId);

      if(descriptor == null){
        logger.debug("Cannot find scrapper descriptor with id " + scrapperImplId)
        descriptor = {
          id: this.options.type,
        } as ScrapperDescriptor;
      }

      logger.info(`Loading scrapper ${descriptor.id} with local loader`)

      try {
        impl = await this.scrapperImplLoader.load(descriptor);
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
        await impl.start({notificationsFacade: CompositionRoot.notificationsFacade, emailService: CompositionRoot.emailService}, scrapperResult, this.options.debug, this.argv);
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
