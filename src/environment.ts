
export let debug = false;

export function _configureEnvironment(debugMode: boolean) {
    debug = debugMode;
    process.env['DEBUG'] = String(debugMode);
}