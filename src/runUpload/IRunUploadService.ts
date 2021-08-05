import { ScrapperRun } from "../scrapper/models/ScrapperRun";


export interface IRunUploadService {
    add(scrapperRun: ScrapperRun): Promise<void>;
    updateAndSendResults(scrapperRun: ScrapperRun): Promise<void>;
}