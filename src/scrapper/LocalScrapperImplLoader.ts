import { ScrapperDescriptor } from "./models/ScrapperDescriptor";
import { ScrapperImplBase } from "./ScrapperImplBase";
import * as path from "path";

export interface IScrapperImplLoaderBase{
    load(scrapperDescriptor: ScrapperDescriptor): Promise<ScrapperImplBase>
}

export class LocalScrapperImplLoader implements IScrapperImplLoaderBase {
    public static readonly loaderTypeStr = "local";
    public readonly resolvedImplDirPath: string;

    constructor(){
        this.resolvedImplDirPath = path.join(process.cwd(), "impls");
    }

    async load(scrapperDescriptor: ScrapperDescriptor): Promise<ScrapperImplBase> {
        let scrapperClass = scrapperDescriptor.id;
        if (!scrapperClass.endsWith("Scrapper")) {
            scrapperClass = scrapperClass + "Scrapper";
        }
        const path = `${this.resolvedImplDirPath}/${scrapperDescriptor.id}/${scrapperClass}`;

        const imported = await import(path);
        console.log(imported[scrapperClass]);

        return new imported[scrapperClass];
    }
}
