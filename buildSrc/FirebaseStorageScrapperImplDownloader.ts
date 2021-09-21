import { ScrapperDescriptor } from "../src/scrapper/models/ScrapperDescriptor";
import * as path from "path";
import * as fs from "fs";
import { admin } from "../src/firebase";


export class FirebaseStorageScrapperImplDownloader {
    private readonly implLoaderMainFolder = "implLoader";
    private readonly implsFolderName = "impls";
    public static readonly loaderTypeStr = "firebaseStorage";


    private removeImplDirContent(dirPath: string){ 
        const files = fs.readdirSync(dirPath)
        for (const file of files) {
            fs.unlinkSync(path.join(dirPath, file))
        }
    }

    async download(scrapperDescriptor: ScrapperDescriptor, appRoot: string) {
        const folderPath = this.implLoaderMainFolder + '/' + scrapperDescriptor.id + '/'
        const implDir = path.join(appRoot, this.implsFolderName, scrapperDescriptor.id);

        var bucket = admin.storage().bucket();
        if (bucket == null) {
            throw new Error(`ScrapperImpl ${scrapperDescriptor.id} does not exist`);
        }
        const response = await bucket.getFiles({prefix: folderPath, });
        
        if (response[0].length <= 1) {
            throw new Error(`ScrapperImpl ${scrapperDescriptor.id} contains no files in bucket`);
        }

        const files = response[0].filter(f => f.name.endsWith("ts") || f.name.endsWith("js"));
        if(!fs.existsSync(implDir)){
            fs.mkdirSync(implDir)
        }else{
            this.removeImplDirContent(implDir)
        }
        for (const file of files) {
            const destinationFile = path.join(implDir, path.basename(file.name));
            await file.download({destination: destinationFile, validation: "md5"})
        }

    }
}