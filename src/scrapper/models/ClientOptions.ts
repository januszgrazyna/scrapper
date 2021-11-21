// prevent 3-valued boolean values
export const DEFAULT_mitmProxyRemoveResult = false;
export const DEFAULT_useMitmProxy = false;
export const DEFAULT_headless = true;

export class ClientOptions {
    proxyAddr?: string;
    headless: boolean = DEFAULT_headless;
    useMitmProxy: boolean = DEFAULT_useMitmProxy;
    mitmProxyRemoveResult: boolean = DEFAULT_mitmProxyRemoveResult;
    useHumanAction: boolean = false;

    constructor(public type: string,
        public labels?: any) { }
}
