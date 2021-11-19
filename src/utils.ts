import {debug} from "./environment";
import { logger } from "./Logging";

export function sleep(time: number, reason: string): Promise<void> {
    logger.debug(`Sleeping ${time}ms for reason: ${reason}`)
    if(debug){
        return Promise.resolve();
    }
    return new Promise((resolve, _) => {
        setTimeout(() => resolve(), time)
    })
}

export function sleepNoLog(time: number): Promise<void> {
    if(debug){
        return Promise.resolve();
    }
    return new Promise((resolve, _) => {
        setTimeout(() => resolve(), time)
    })
}