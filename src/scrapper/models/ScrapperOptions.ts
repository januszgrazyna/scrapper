import { RunConfigurationId } from "./ScrapperResult";

export class ScrapperOptions {
    type: string = "Default";
    runConfigurationId: RunConfigurationId | null = null;
    debug: boolean = false;
}
