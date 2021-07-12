

export interface IResultsUpload {
    uploadResults(outputDirectory: string, results: any): Promise<void>;
}