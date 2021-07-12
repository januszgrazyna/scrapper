
export class ScrapperRun{
    
    public id: string;
    public dateCreated: Date;
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
    ){
        const now = new Date();
        this.id = `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}_${now.getHours()}-${now.getMinutes()}-${now.getSeconds()}`;
        this.dateCreated = now;
    }

    public ensureValid(){
        if(this.results !== undefined || this.outputDirectory == null){
            throw new Error("ScrapperRun instance is not valid")
        } 
    }
}