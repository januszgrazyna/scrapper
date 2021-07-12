

export interface IOutputUpload {
    uploadOutputFolder(outputDirectory: string): Promise<void>;
}