import { ScrapperRun } from "../scrapper/ScrapperRun";


export interface IResultsUpload {
    uploadResults(scrapperRun: ScrapperRun): Promise<void>;
}