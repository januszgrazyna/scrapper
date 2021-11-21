import { logger } from "@src/Logging";
import { MitmProxyRunner } from "./mitmProxyRunner";
import { ClientOptions } from "./models/ClientOptions";
import { ScrapperResult } from "./models/ScrapperResult";
import { ScrapperImplBase } from "./ScrapperImplBase";

export class HumanActionRunner{
    private timesCalled = 0;

  async tryRepair(implAction: () => Promise<void>, humanErrorAction: () => Promise<void>, argv: any): Promise<void> {
    const mitmProxyRunner = new MitmProxyRunner();
    this.timesCalled++;

    if(this.timesCalled == 2){
        throw new Error(`Could not repair scrapper`);
    }

    await mitmProxyRunner.start(argv);
    try{
        logger.debug(`Repairing scrapper with human action`);
        await implAction();
    }catch(error){
        if(!(error instanceof HumanActionError)){
            throw error;
        }

        await humanErrorAction();
    }
    await mitmProxyRunner.stop(true);

    await implAction();

  }

}