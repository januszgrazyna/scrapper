import * as fs from "fs";
import { deepStrictEqual } from "assert";
import { admin } from "./firebase";
import * as path from "path";
import { ScrapperResult } from "../scrapper/models/ScrapperResult";
import { logger } from '../Logging';
import { IResultUploadService } from "../scrapper/services/IResultUploadService";

function trimBackingFieldNames(obj: any): any{
    const result: any = {}
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            let resultKey = key;
            if(resultKey.includes("_")){
                resultKey = key.replace("_", "")
            }
            result[resultKey] = obj[key]
        }
    }
    return result
}

function setDateFieldsToJsonStr(obj:any) {
    for (const key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            if(obj[key] instanceof Date){
                obj[key] = (obj[key] as Date).toJSON()
            }
        }
    }
    return obj
}


export class FirebaseResultUploadService implements IResultUploadService {
    
    private replaceBackwardSlashes(str: string | null | undefined){
        if(str == null){
            return null;
        }
        if(str == undefined){
            return undefined;
        }
        return str.replace(/\\/g, "/");
    }

    async updateResults(scrapperResult: ScrapperResult): Promise<void> {
        logger.debug(`Updating result with id ${scrapperResult.id}`)
        const results = admin.firestore().collection("results");
        let scrapperResultTrimmed = trimBackingFieldNames(scrapperResult);
        scrapperResultTrimmed = setDateFieldsToJsonStr(scrapperResultTrimmed)
        await results.doc(scrapperResult.id).update({
            ...scrapperResultTrimmed, "outputDirectory": this.replaceBackwardSlashes(scrapperResult.outputDirectory), 
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
            ...scrapperResultData, "outputDirectory": this.replaceBackwardSlashes(scrapperResult.outputDirectory), 
            "resultData": (scrapperResult.resultData ? JSON.stringify(scrapperResult.resultData) : scrapperResult.resultData)
        })
    }
}