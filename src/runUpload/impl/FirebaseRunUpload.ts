import { IRunUpload } from "../IRunUpload";
import * as fs from "fs";
import { deepStrictEqual } from "assert";
import { admin } from "../../firebase";
import * as path from "path";
import { ScrapperRun } from "../../scrapper/ScrapperRun";
import { setDateFieldsToJsonStr, trimBackingFieldNames } from "../../utils";

export class FirebaseRunUpload implements IRunUpload {
    async add(scrapperRun: ScrapperRun): Promise<void> {
        const runs = admin.firestore().collection("runs");
        let scrapperRunData = trimBackingFieldNames(scrapperRun);
        scrapperRunData = setDateFieldsToJsonStr(scrapperRunData)
        await runs.doc(scrapperRun.id).set({
            ...scrapperRunData, "results": (scrapperRun.results ? JSON.stringify(scrapperRun.results) : scrapperRun.results)
        })
    }
    async updateAndSendResults(scrapperRun: ScrapperRun): Promise<void> {
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
        let scrapperRunData = trimBackingFieldNames(scrapperRun);
        scrapperRunData = setDateFieldsToJsonStr(scrapperRunData)
        await runs.doc(scrapperRun.id).update({
            ...scrapperRunData, "results": (scrapperRun.results ? JSON.stringify(scrapperRun.results) : scrapperRun.results)
        })
    }

}