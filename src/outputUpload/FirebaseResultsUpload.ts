import { IResultsUpload } from "./IResultsUpload";
import * as fs from "fs";
import { deepStrictEqual } from "assert";
import { admin } from "../firebase";
import * as path from "path";
import { ScrapperRun } from "../scrapper/ScrapperRun";

export class FirebaseResultsUpload implements IResultsUpload {
    async uploadResults(scrapperRun: ScrapperRun): Promise<void> {
        if(!fs.existsSync(scrapperRun.outputDirectory!)){
            throw new Error(`Output directory ${scrapperRun.outputDirectory!} doesn't exist`);
        }
        const outputDirRelative = scrapperRun.outputDirectory!.split(path.sep).slice(-2).reduce((acc, x) => path.join(acc, x), "")
        const files = fs.readdirSync(scrapperRun.outputDirectory!);
        var bucket = admin.storage().bucket();
        const runs = admin.firestore().collection("runs");
        console.log(`Sending ${files.length} files from ${scrapperRun.outputDirectory} into ${outputDirRelative}`)
        for (const file of files) {            
            await bucket.upload(file, {destination: path.join(outputDirRelative, path.basename(file))})
        }
        await runs.doc(scrapperRun.id).set({
            ...scrapperRun, "dateCreated": scrapperRun.dateCreated.toJSON()
        })
    }

}