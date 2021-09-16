import { FirebaseStorageScrapperImplDownloader } from "../buildSrc/FirebaseStorageScrapperImplDownloader";
import { LocalScrapperImplLoader } from "../src/scrapper/LocalScrapperImplLoader";
import * as fs from "fs";
import * as path from "path";

function rmTestDir(){
    const localImplLoader = new LocalScrapperImplLoader();
    const testFolderPath = path.join(localImplLoader.resolvedImplDirPath, 'Test')
    if(!fs.existsSync(testFolderPath)){
        return;
    }
    const files = fs.readdirSync(testFolderPath)
    for (const file of files) {
        fs.unlinkSync(path.join(testFolderPath, file))
    }
    fs.rmdirSync(testFolderPath)
}

afterAll(() => {
    rmTestDir()
})


test('', async () => {
    const loader = new FirebaseStorageScrapperImplDownloader();
    const implsDir = path.join(process.cwd(), "impls");
    await loader.download({id: 'Test' }, process.cwd())
    expect(fs.existsSync(path.join(implsDir, "Test"))).toBeTruthy()
})