import { RunConfigurationId } from "./ScrapperRun";

export class ScrapperOptions {
    type: string = "Default";
    runConfigurationId: RunConfigurationId | null = null;
    debug: boolean = false;
}
