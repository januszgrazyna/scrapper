import { ScrapperImpl, ScrapperImplId } from "./ScrapperImpl";

export type ScrapperRunId = string;

export class ScrapperRun{
    
    public readonly id: ScrapperRunId;
    public readonly implId: ScrapperImplId;
    public readonly dateCreated: Date;
    public outputDirectory?: string;
    public error: boolean = false;

    private _results : any | null;
    public get results() : any | null {
        return this._results;
    }
    public set results(v : any | null) {
        v = v ?? null;
        this._results = v;
    }

    constructor(
        impl: ScrapperImpl
    ){
        const now = new Date();
        this.id = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
        this.dateCreated = now;
        this.implId = impl.id;
    }

    public ensureValid(){
        if(this.results === undefined || this.outputDirectory == null){
            throw new Error("ScrapperRun instance is not valid")
        } 
    }
}