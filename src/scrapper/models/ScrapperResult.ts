import { ScrapperImplBase, ScrapperImplId } from "../ScrapperImplBase";

export type ScrapperResultId = string;

export type ScrapperRunStatus =
    | "running"
    | "finished"
    | "failed"


export class ScrapperResult{
    
    public readonly id: ScrapperResultId;
    public readonly implId: ScrapperImplId;
    public readonly dateCreated: Date;
    public readonly labels?: any;

    private _outputDirectory: string | null = null;
    private _dateFinished: Date | null = null;
    private _status: ScrapperRunStatus;
    private _resultData : any | null = null;

    constructor(
        impl: ScrapperImplBase, labels?: any
    ){
        const now = new Date();
        this.id = `${impl.id}_${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
        this.dateCreated = now;
        this.implId = impl.id;
        this._status = "running";
        this.labels = labels;
    }

    public get resultData() : any | null {
        return this._resultData;
    }
    public set resultData(v : any | null) {
        v = v ?? null;
        this._resultData = v;
        this.ensureValid();
    }
    public get status(): ScrapperRunStatus {
        return this._status;
    }
    public get dateFinished(): Date | null {
        return this._dateFinished;
    }

    public get outputDirectory(): string | null{
        return this._outputDirectory;
    }
    public set outputDirectory(v: string | null){
        if(!v){
            throw new Error("Cannot set null output directory")
        }
        this._outputDirectory = v;
        this.ensureValid();
    }

    public setFinished(){
        if(this._status != "running" || this.dateFinished){
            throw new Error("Cannot set scrapperRun status")
        }
        this._status = "finished";
        this._dateFinished = new Date();
        this.ensureValid();
    }

    public setFailed(){
        if(this._status != "running" || this.dateFinished){
            throw new Error("Cannot set scrapperRun status")
        }
        this._status = "failed";
        this._dateFinished = new Date();
        this.ensureValid();
    }

    public ensureValid(){
        if(this.resultData === undefined || this._outputDirectory == null){
            throw new Error("ScrapperRun instance is not valid")
        } 
    }
}