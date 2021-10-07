import { IResultUploadService } from "../IResultUploadService";
import * as fs from "fs";
import { deepStrictEqual } from "assert";
import { admin } from "../../firebase";
import * as path from "path";
import { ScrapperResult } from "../../scrapper/models/ScrapperResult";
import { setDateFieldsToJsonStr, trimBackingFieldNames } from "../../utils";
import { logger } from '../../Logging';

export class FirebaseResultUploadService implements IResultUploadService {
    
    private replaceBackwardSlashes(str: string): string{
        return str.replace(/\\/g, "/");
    }

    async updateResults(scrapperResult: ScrapperResult): Promise<void> {
        logger.debug(`Updating result with id ${scrapperResult.id}`)
        const results = admin.firestore().collection("results");
        let scrapperResultTrimmed = trimBackingFieldNames(scrapperResult);
        scrapperResultTrimmed = setDateFieldsToJsonStr(scrapperResultTrimmed)
        await results.doc(scrapperResult.id).update({
            ...scrapperResultTrimmed, "outputDirectory": this.replaceBackwardSlashes(scrapperResult.outputDirectory!), 
            "resultData" : (scrapperResult.resultData ? JSON.stringify(scrapperResult.resultData) : scrapperResult.resultData)
        })
    }

    async sendOutputs(scrapperResult: ScrapperResult): Promise<void> {
        //assuming output directory is set as current directory
        const outputDir = process.cwd()
        if(!fs.existsSync(outputDir)){
            throw new Error(`Output directory ${outputDir} doesn't exist`);
        }

        const files = fs.readdirSync(outputDir);
        var bucket = admin.storage().bucket();
        for (const file of files) {            
            console.log(file)
            await bucket.upload(file, {destination: this.replaceBackwardSlashes(scrapperResult.outputDirectory!) + "/" + path.basename(file)})
        }
    }

    async add(scrapperResult: ScrapperResult): Promise<void> {
        logger.debug(`Adding result with id ${scrapperResult.id}`)
        const results = admin.firestore().collection("results");
        let scrapperResultData = trimBackingFieldNames(scrapperResult);
        scrapperResultData = setDateFieldsToJsonStr(scrapperResultData)
        await results.doc(scrapperResult.id).set({
            ...scrapperResultData, "outputDirectory": this.replaceBackwardSlashes(scrapperResult.outputDirectory!), 
            "resultData": (scrapperResult.resultData ? JSON.stringify(scrapperResult.resultData) : scrapperResult.resultData)
        })
    }
}