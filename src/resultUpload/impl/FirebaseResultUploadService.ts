import { IResultUploadService } from "../IResultUploadService";
import * as fs from "fs";
import { deepStrictEqual } from "assert";
import { admin } from "../../firebase";
import * as path from "path";
import { ScrapperResult } from "../../scrapper/models/ScrapperRun";
import { setDateFieldsToJsonStr, trimBackingFieldNames } from "../../utils";

export class FirebaseResultUploadService implements IResultUploadService {
    
    async updateResults(scrapperResult: ScrapperResult): Promise<void> {
        const results = admin.firestore().collection("results");
        let scrapperResultData = trimBackingFieldNames(scrapperResult);
        scrapperResultData = setDateFieldsToJsonStr(scrapperResultData)
        await results.doc(scrapperResult.id).update({
            ...scrapperResultData, "results": (scrapperResult.results ? JSON.stringify(scrapperResult.results) : scrapperResult.results)
        })
    }

    async sendOutputs(scrapperResult: ScrapperResult): Promise<void> {
        //assuming output directory is set as current directory
        const fullOutputDir = process.cwd()
        if(!fs.existsSync(fullOutputDir)){
            throw new Error(`Output directory ${fullOutputDir} doesn't exist`);
        }

        const files = fs.readdirSync(fullOutputDir);
        var bucket = admin.storage().bucket();
        console.log(`Sending ${files.length} files from ${fullOutputDir} into ${scrapperResult.outputDirectory!}`)
        for (const file of files) {            
            await bucket.upload(file, {destination: path.join(scrapperResult.outputDirectory!, path.basename(file))})
        }
    }

    async add(scrapperResult: ScrapperResult): Promise<void> {
        const results = admin.firestore().collection("results");
        let scrapperResultData = trimBackingFieldNames(scrapperResult);
        scrapperResultData = setDateFieldsToJsonStr(scrapperResultData)
        await results.doc(scrapperResult.id).set({
            ...scrapperResultData, "results": (scrapperResult.results ? JSON.stringify(scrapperResult.results) : scrapperResult.results)
        })
    }
}