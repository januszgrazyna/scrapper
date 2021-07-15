import { ScrapperRun } from "../scrapper/ScrapperRun";


export interface IRunUpload {
    upload(scrapperRun: ScrapperRun): Promise<void>;
}