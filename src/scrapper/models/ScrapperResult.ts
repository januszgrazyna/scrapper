import { ScrapperImplBase, ScrapperImplId } from "../ScrapperImplBase";

export type ScrapperRunId = string;

export type ScrapperRunStatus =
    | "running"
    | "finished"
    | "failed"

export type RunConfigurationId = string;

export class ScrapperResult{
    
    public readonly id: ScrapperRunId;
    public readonly implId: ScrapperImplId;
    public readonly dateCreated: Date;
    public readonly runConfigurationId: RunConfigurationId;

    private _outputDirectory: string | null = null;
    private _dateFinished: Date | null = null;
    private _status: ScrapperRunStatus;
    private _results : any | null = null;

    constructor(
        impl: ScrapperImplBase, runConfigurationId: RunConfigurationId
    ){
        const now = new Date();
        this.id = `${impl.id}_${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
        this.dateCreated = now;
        this.implId = impl.id;
        this.runConfigurationId = runConfigurationId;
        this._status = "running";
    }

    public get results() : any | null {
        return this._results;
    }
    public set results(v : any | null) {
        v = v ?? null;
        this._results = v;
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
        if(this.results === undefined || this._outputDirectory == null){
            throw new Error("ScrapperRun instance is not valid")
        } 
    }
}