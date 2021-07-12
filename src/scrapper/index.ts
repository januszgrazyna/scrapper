import Scrapper from "./Scrapper";
import { ScrapperOptions } from "./ScrapperOptions";
import { stopLogger } from '../Logging';
import { FirebaseOutputUpload } from "../outputUpload/FirebaseOutputUpload";


export async function start(opt: ScrapperOptions = new ScrapperOptions(), argv: any) {
    let scrapper = new Scrapper(opt, new FirebaseOutputUpload(), argv)
    await scrapper.start();
    stopLogger();
}