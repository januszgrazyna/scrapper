import { ScrapperImpl, ScrapperImplId } from "./ScrapperImpl";

export type ScrapperRunId = string;

export class ScrapperRun{
    
    public readonly id: ScrapperRunId;
    public readonly implId: ScrapperImplId;
    public readonly dateCreated: Date;
    public outputDirectory?: string;
    

    private _results : any;
    public get results() : any {
        return this._results;
    }
    public set results(v : any) {
        v = v ?? null;
        this._results = v;
    }

    constructor(
        impl: ScrapperImpl
    ){
        const now = new Date();
        this.id = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
        this.dateCreated = now;
        this.implId = impl.implId;
    }

    public ensureValid(){
        if(this.results === undefined || this.outputDirectory == null){
            throw new Error("ScrapperRun instance is not valid")
        } 
    }
}