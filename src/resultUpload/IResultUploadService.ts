import { ScrapperResult } from "../scrapper/models/ScrapperRun";


export interface IResultUploadService {
    add(scrapperResult: ScrapperResult): Promise<void>;
    updateAndSendResults(scrapperResult: ScrapperResult): Promise<void>;
}