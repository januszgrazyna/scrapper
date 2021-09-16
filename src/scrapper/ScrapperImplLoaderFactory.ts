import { FirebaseStorageScrapperImplLoader } from "./FirebaseStorageScrapperImplLoader";
import { IScrapperImplLoaderBase, LocalScrapperImplLoader } from "./LocalScrapperImplLoader";
import { ScrapperDescriptor } from "./models/ScrapperDescriptor";

export function createScrapperImplLoader(descriptor: ScrapperDescriptor): IScrapperImplLoaderBase{
    switch(descriptor.loaderType){
        case LocalScrapperImplLoader.loaderTypeStr:
            return new LocalScrapperImplLoader();
        case FirebaseStorageScrapperImplLoader.loaderTypeStr:
            return new FirebaseStorageScrapperImplLoader();
    }

    throw new Error(`Loader type ${descriptor.loaderType} not implemented`);
}