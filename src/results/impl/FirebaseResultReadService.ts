import { ScrapperResult } from "../../scrapper/models/ScrapperResult";
import { IResultReadService } from "../IResultReadService";
import { admin } from "../../firebase";

export class FirebaseResultReadService implements IResultReadService {


    async getLatestResult(implId: string): Promise<ScrapperResult | null> {
        const results = admin.firestore().collection("results");
        const qSnap = await results
        .where("implId", "==", implId)
        .orderBy("dateCreated", "desc")
        .limit(1)
        .get(); 
        
        if(qSnap.empty){
            return null;
        }
        return qSnap.docs[0].data() as ScrapperResult;
    }
    
}