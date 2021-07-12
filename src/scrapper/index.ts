import Scrapper from "./Scrapper";
import { ScrapperOptions } from "./ScrapperOptions";
import { stopLogger } from '../Logging';
import { FirebaseResultsUpload } from "../outputUpload/FirebaseResultsUpload";


export async function start(opt: ScrapperOptions = new ScrapperOptions(), argv: any) {
    let scrapper = new Scrapper(opt, new FirebaseResultsUpload(), argv)
    await scrapper.start();
    stopLogger();
}