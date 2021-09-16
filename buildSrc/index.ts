import { FirebaseStorageScrapperImplDownloader } from "./FirebaseStorageScrapperImplDownloader";
import { scrapperDescriptorRead } from '../src/CompositionRoot'
import * as path from "path";
import * as fs from "fs";

const appRoot = process.argv[2]
if(!appRoot){
    throw new Error("Invalid appRoot parameter");
}
const implsDir = path.join(appRoot, "impls");
if(!fs.existsSync(implsDir)){
    fs.mkdirSync(implsDir)
}

const implToDownload = process.argv.slice(3)

const downloader = new FirebaseStorageScrapperImplDownloader();
(async () => {

    for (const implId of implToDownload) {
        const descriptor = await scrapperDescriptorRead.getScrapperDescriptor(implId);
        if(!descriptor){
            throw new Error("Cannot find descriptor with id " + implId);
        }
        console.log('Downloading ' + descriptor.id);
        await downloader.download(descriptor, appRoot)
    }
})()
