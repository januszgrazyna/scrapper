import { RunConfigurationId } from "./ScrapperResult";

export class ScrapperOptions {
    type: string = "Default";
    runConfigurationId: RunConfigurationId | null = null;
    proxyAddr?: string;
}
