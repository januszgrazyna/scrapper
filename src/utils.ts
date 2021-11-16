import {debug} from "./environment";

export function sleep(time: number): Promise<void> {
    if(debug){
        return Promise.resolve();
    }
    return new Promise((resolve, _) => {
        setTimeout(() => resolve(), time)
    })
}