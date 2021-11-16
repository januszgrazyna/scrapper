import { ScrapperDescriptor } from "../models/ScrapperDescriptor";
import { ScrapperImplId } from "../ScrapperImplBase";

export interface IScrapperDescriptorRead {
    getAllScrapperDescriptors(): Promise<ScrapperDescriptor[]>
    getScrapperDescriptor(scrapperImplId: ScrapperImplId): Promise<ScrapperDescriptor | null>
}