import { ScrapperDescriptor } from "./models/ScrapperDescriptor";
import { ScrapperImplBase } from "./ScrapperImplBase";
import * as path from "path";

export class LocalScrapperImplLoader {
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
        const importPath = path.join(this.resolvedImplDirPath, scrapperDescriptor.id, scrapperClass);

        const imported = await import(importPath);
        console.log(imported[scrapperClass]);

        return new imported[scrapperClass];
    }
}
