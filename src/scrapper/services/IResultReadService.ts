import { ScrapperImplId } from "../ScrapperImplBase";
import { ScrapperResult } from "../models/ScrapperResult";

export interface IResultReadService {
    getLatestResult(implId: ScrapperImplId): Promise<ScrapperResult | null>;
}