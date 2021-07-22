import { IRunUpload } from "../IRunUpload";
import * as fs from "fs";
import { deepStrictEqual } from "assert";
import { admin } from "../../firebase";
import * as path from "path";
import { ScrapperRun } from "../../scrapper/ScrapperRun";

export class FirebaseRunUpload implements IRunUpload {
    async upload(scrapperRun: ScrapperRun): Promise<void> {
        //assuming output directory is set as current directory
        const fullOutputDir = process.cwd()
        if(!fs.existsSync(fullOutputDir)){
            throw new Error(`Output directory ${fullOutputDir} doesn't exist`);
        }

        const files = fs.readdirSync(fullOutputDir);
        var bucket = admin.storage().bucket();
        const runs = admin.firestore().collection("runs");
        console.log(`Sending ${files.length} files from ${fullOutputDir} into ${scrapperRun.outputDirectory!}`)
        for (const file of files) {            
            await bucket.upload(file, {destination: path.join(scrapperRun.outputDirectory!, path.basename(file))})
        }
        await runs.doc(scrapperRun.id).set({
            ...scrapperRun, "dateCreated": scrapperRun.dateCreated.toJSON(), "_results": (scrapperRun.results ? JSON.stringify(scrapperRun.results) : scrapperRun.results)
        })
    }

}