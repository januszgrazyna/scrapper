import { logger, configureLogger, stopLogger, configureCwdInfoLogger } from '../Logging';
import { ScrapperImplBase, ScrapperImplId } from './ScrapperImplBase';
import { LocalScrapperImplLoader } from './LocalScrapperImplLoader';
import { ClientOptions } from './models/ClientOptions';
import * as fs from "fs";
import * as path from "path";
import { ScrapperResult } from './models/ScrapperResult';
import * as CompositionRoot from '../CompositionRoot';
import { IScrapperDescriptorRead } from '../scrapper/services/IScrapperDescriptorRead';
import { ScrapperDescriptor } from './models/ScrapperDescriptor';
import { MitmProxyRunner } from './mitmProxyRunner';
import { IResultUploadService } from '../scrapper/services/IResultUploadService';
import { debug } from '../environment';


export default class Scrapper {
    private outputDir?: string;
    private scrapperImplLoader = new LocalScrapperImplLoader();

    constructor(
        private resultUploadService: IResultUploadService,
        private scrapperDescriptorRead: IScrapperDescriptorRead,
    ) {}

    private async loadImpl(options: ClientOptions): Promise<ScrapperImplBase> {
      let impl: ScrapperImplBase;
      const scrapperImplId = options.type as ScrapperImplId;
      let descriptor = await this.scrapperDescriptorRead.getScrapperDescriptor(scrapperImplId);

      if(descriptor == null){
        logger.debug("Cannot find scrapper descriptor with id " + scrapperImplId)
        descriptor = {
          id: options.type,
        } as ScrapperDescriptor;
      }

      logger.info(`Loading scrapper ${descriptor.id} with local loader`)

      try {
        impl = await this.scrapperImplLoader.load(descriptor);
        return impl;
      } catch (error) {
        logger.error(`Cannot load scrapper ${options.type}: ${error}`);
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

    async start(options: ClientOptions, argv?: any): Promise<ScrapperResult> {
      if(debug && options.headless && !argv.headless){
        options.headless = false;
      }

      configureLogger();
      const impl = await this.loadImpl(options);
      const scrapperResult = new ScrapperResult(impl, options.labels)
      this.setOutputDir(scrapperResult);
      configureCwdInfoLogger();

      let mitmProxyRunner: MitmProxyRunner | undefined;
      if(options.useMitmProxy){
        mitmProxyRunner = new MitmProxyRunner();
        // treat error as unexpected
        await this.tryStartMitmProxy(mitmProxyRunner, options, argv);
      }

      logger.info(`Scrapper ${impl.id} (${impl.version}) starting in ${this.outputDir} directory`)

      try {
        await this.resultUploadService.add(scrapperResult)
        scrapperResult.outputDirectory = this.outputDir!;
        await impl.start({notificationsFacade: CompositionRoot.notificationsFacade, emailService: CompositionRoot.emailService, resultReadService: CompositionRoot.resultReadService}, scrapperResult, argv);
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
        if(mitmProxyRunner){
          await this.tryStopMitmProxy(mitmProxyRunner, options);
        }
        await this.updateResultsAndSendOutputs(scrapperResult)
      }
      
      return scrapperResult;
    }

    private async tryStartMitmProxy(mitmProxyRunner: MitmProxyRunner, options: ClientOptions, argv?: any): Promise<void> {
      try {
        await mitmProxyRunner.start(argv);
        options.proxyAddr = argv.proxyAddr;
      } catch (error) {
        logger.error("Error while trying to start mitmproxy");
        logger.error(error);
        throw error;
      }
    }

    private async tryStopMitmProxy(mitmProxyRunner: MitmProxyRunner, options: ClientOptions): Promise<void>{
      try {
        const stopSuccess = await mitmProxyRunner.stop(options.mitmProxyRemoveResult);
        if(!stopSuccess){
          console.log('Could not stop mitmproxy');
        }
      } catch (error) {
        //TODO logging
        console.log('Error while stopping mitmproxy')
        console.log(error);
      }
    }

    private async updateResultsAndSendOutputs(scrapperResult: ScrapperResult): Promise<void> {
      try {
        await this.resultUploadService.updateResults(scrapperResult);
      } catch (error) {
        // @ts-ignore
        logger.error(`Error raised while updating scrapper result ${impl.id}: ${error}`)
        // @ts-ignore
        logger.error(`${error.stack}`)
        return;
      }

      logger.debug(`Sending files from ${process.cwd()} into ${scrapperResult.outputDirectory!}`)
      stopLogger()

      try {
        await this.resultUploadService.sendOutputs(scrapperResult);
      } catch (error) {
        //TODO stop only log to file
        // @ts-ignore
        console.log(`Error raised while sending output files ${impl.id}: ${error}`)
        // @ts-ignore
        console.log(`${error.stack}`)
        return;
      }
    }

    async stop() {

    }
}
