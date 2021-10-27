import { ScrapperImplId } from "../scrapper/ScrapperImplBase";
import { ScrapperResult } from "../scrapper/models/ScrapperResult";

export interface IResultReadService {
    getLatestResult(implId: ScrapperImplId): Promise<ScrapperResult | null>;
}