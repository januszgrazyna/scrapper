import { ScrapperImpl } from "./ScrapperImpl";

export class ScrapperImplLoader {
    private _modulesPath: string;
    constructor(modulesPath: string = "./impl") {
        this._modulesPath = modulesPath;
    }

    async load(name: string): Promise<ScrapperImpl> {
        let scrapperClass = name
        if (!scrapperClass.endsWith("Scrapper")) {
            scrapperClass = scrapperClass + "Scrapper";
        }
        const path = `${this._modulesPath}/${name.toLowerCase()}/${scrapperClass}`;

        const imported = await import(path);
        console.log(imported[scrapperClass]);

        return new imported[scrapperClass];
    }
}
