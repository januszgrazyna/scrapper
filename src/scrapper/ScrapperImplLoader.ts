import { ScrapperImpl } from "./impl/ScrapperImpl";

export class ScrapperImplLoader {
    private _modulesPath: string;
    constructor(modulesPath: string = "./impl") {
        this._modulesPath = modulesPath;
    }

    async load(name: string): Promise<ScrapperImpl> {
        if (!name.endsWith("Scrapper")) {
            name = name + "Scrapper";
        }
        const path = `${this._modulesPath}/${name}`;

        const imported = await import(path);
        console.log(imported[name]);

        return new imported[name];
    }
}
