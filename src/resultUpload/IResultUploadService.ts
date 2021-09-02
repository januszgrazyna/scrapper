import { ScrapperResult } from "../scrapper/models/ScrapperRun";


export interface IResultUploadService {
    add(scrapperResult: ScrapperResult): Promise<void>;
    updateResults(scrapperResult: ScrapperResult): Promise<void>;
    sendOutputs(scrapperResult: ScrapperResult): Promise<void>;
}