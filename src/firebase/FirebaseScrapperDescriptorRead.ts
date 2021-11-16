import { IScrapperDescriptorRead } from "../scrapper/IScrapperDescriptorRead";
import { ScrapperDescriptor } from "../scrapper/models/ScrapperDescriptor";
import { admin } from "./firebase";

export class FirebaseScrapperDescriptorRead implements IScrapperDescriptorRead {
    constructor(private collectionName: string){

    }

    private getCollection() {
        return admin.firestore().collection(this.collectionName);
    }

    async getScrapperDescriptor(scrapperImplId: string): Promise<ScrapperDescriptor | null> {
        const scrapperImplCol = this.getCollection();
        const result = await scrapperImplCol.doc(scrapperImplId).get();
        
        if (!result || !result.exists) {
            return null;
        }

        return result.data() as ScrapperDescriptor;
    }
    async getAllScrapperDescriptors(): Promise<ScrapperDescriptor[]> {
        const scrapperImplCol = this.getCollection();
        const result = await scrapperImplCol.get();
        return result.docs.map(d => d.data() as ScrapperDescriptor)
    }

}