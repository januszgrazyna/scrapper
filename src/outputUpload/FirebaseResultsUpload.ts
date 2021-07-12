import { IResultsUpload } from "./IResultsUpload";
import * as fs from "fs";
import { deepStrictEqual } from "assert";
import { admin } from "../firebase";
import * as path from "path";

export class FirebaseResultsUpload implements IResultsUpload {
    async uploadResults(outputDirectory: string, results: any): Promise<void> {
        if(!fs.existsSync(outputDirectory)){
            throw new Error(`Output directory ${outputDirectory} doesn't exist`);
        }
        const outputDirRelative = outputDirectory.split(path.sep).slice(-2).reduce((acc, x) => path.join(acc, x), "")
        const files = fs.readdirSync(outputDirectory);
        var bucket = admin.storage().bucket();
        const runs = admin.firestore().collection("runs");
        console.log(`Sending ${files.length} files from ${outputDirectory} into ${outputDirRelative}`)
        for (const file of files) {            
            await bucket.upload(file, {destination: path.join(outputDirRelative, path.basename(file))})
        }
        await runs.doc(outputDirRelative.split(path.sep).slice(-1)[0]).set({
        })
    }

}