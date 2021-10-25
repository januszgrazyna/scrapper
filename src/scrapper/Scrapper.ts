import { logger, configureLogger, stopLogger, configureCwdInfoLogger } from '../Logging';
import { ScrapperImplBase, ScrapperImplId } from './ScrapperImplBase';
import { LocalScrapperImplLoader } from './LocalScrapperImplLoader';
import { ScrapperOptions } from './models/ScrapperOptions';
import * as fs from "fs";
import * as path from "path";
import { IResultUploadService } from '../results/IResultUploadService';
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

    
    private setOutputDir(scrapperResult: ScrapperResult){
      if(!fs.existsSync("outputs")){
          fs.mkdirSync("outputs");
      }
      const dir = this.outputDir = path.join("outputs", scrapperResult.id);
      fs.mkdirSync(dir)
      process.chdir(dir)
    }

    async start(): Promise<ScrapperResult> {
      configureLogger();
      const impl = await this.loadImpl();
      const scrapperResult = new ScrapperResult(impl, this.options.runConfigurationId!)
      this.setOutputDir(scrapperResult);
      configureCwdInfoLogger();
      logger.info(`Scrapper ${impl.id} starting in ${this.outputDir} directory`)

      try {
        await this.resultUploadService.add(scrapperResult)
        scrapperResult.outputDirectory = this.outputDir!;
        await impl.start({notificationsFacade: CompositionRoot.notificationsFacade, emailService: CompositionRoot.emailService}, scrapperResult, this.argv);
        scrapperResult.setFinished()
        logger.info('Scrapper succesfully finished')
      } catch (error) {
        // @ts-ignore
        logger.error(`Error raised while running scrapper ${impl.id}: ${error}`)
        // @ts-ignore
        logger.error(`${error.stack}`)
        scrapperResult.setFailed()
      }
      finally{
        this.updateResultsAndSendOutputs(scrapperResult)
      }
      return scrapperResult;
    }

    private async updateResultsAndSendOutputs(scrapperResult: ScrapperResult): Promise<void> {
      await this.resultUploadService.updateResults(scrapperResult);
      logger.debug(`Sending files from ${process.cwd()} into ${scrapperResult.outputDirectory!}`)
      stopLogger()
      await this.resultUploadService.sendOutputs(scrapperResult);
    }

    async stop() {

    }
}
