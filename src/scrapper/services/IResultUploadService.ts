import { ScrapperResult } from "../models/ScrapperResult";


export interface IResultUploadService {
    add(scrapperResult: ScrapperResult): Promise<void>;
    updateResults(scrapperResult: ScrapperResult): Promise<void>;
    sendOutputs(scrapperResult: ScrapperResult): Promise<void>;
}