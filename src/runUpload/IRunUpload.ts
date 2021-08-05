import { ScrapperRun } from "../scrapper/ScrapperRun";


export interface IRunUpload {
    add(scrapperRun: ScrapperRun): Promise<void>;
    updateAndSendResults(scrapperRun: ScrapperRun): Promise<void>;
}