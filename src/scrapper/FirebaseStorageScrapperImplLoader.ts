import { ScrapperDescriptor } from "./models/ScrapperDescriptor";
import { ScrapperImplBase } from "./ScrapperImplBase";
import * as path from "path";
import * as fs from "fs";
import { admin } from "../firebase";
import { IScrapperImplLoaderBase, LocalScrapperImplLoader } from "./LocalScrapperImplLoader";


export class FirebaseStorageScrapperImplLoader implements IScrapperImplLoaderBase {
    private readonly implLoaderMainFolder = "implLoader";
    private localImplLoader = new LocalScrapperImplLoader();
    public static readonly loaderTypeStr = "firebaseStorage";

    private removeImplDir(dirPath: string){ 
        const files = fs.readdirSync(dirPath)
        for (const file of files) {
            fs.unlinkSync(path.join(dirPath, file))
        }
        fs.rmdirSync(dirPath)
    }

    async load(scrapperDescriptor: ScrapperDescriptor): Promise<ScrapperImplBase> {
        const folderPath = this.implLoaderMainFolder + '/' + scrapperDescriptor.id + '/'
        const implDir = path.join(this.localImplLoader.resolvedImplDirPath, scrapperDescriptor.id);

        var bucket = admin.storage().bucket();
        if (bucket == null) {
            throw new Error(`ScrapperImpl ${scrapperDescriptor.id} does not exist`);
        }
        const response = await bucket.getFiles({prefix: folderPath, });
        
        if (response[0].length <= 1) {
            throw new Error(`ScrapperImpl ${scrapperDescriptor.id} contains no files in bucket`);
        }

        const files = response[0].filter(f => f.name.endsWith("ts"));
        if(!fs.existsSync(implDir)){
            fs.mkdirSync(implDir)
        }else{
            this.removeImplDir(implDir)
        }
        for (const file of files) {
            const destinationFile = path.join(implDir, path.basename(file.name));
            fs.closeSync(fs.openSync(destinationFile, 'w'));
            await file.download({ destination: destinationFile });
        }

        return this.localImplLoader.load(scrapperDescriptor);
    }
}
