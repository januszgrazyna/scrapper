import { RunConfigurationId } from "./ScrapperResult";

export class CliOptions {
    type: string = "Default";
    runConfigurationId: RunConfigurationId | null = null;
    proxyAddr?: string;
    headless: boolean = true;
    mitmProxySave: boolean = false;
    mitmProxySendResult: boolean = false;
}
