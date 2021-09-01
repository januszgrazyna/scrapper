import { ScrapperResult } from "../scrapper/models/ScrapperRun";


export interface IRunUploadService {
    add(scrapperRun: ScrapperResult): Promise<void>;
    updateAndSendResults(scrapperRun: ScrapperResult): Promise<void>;
}