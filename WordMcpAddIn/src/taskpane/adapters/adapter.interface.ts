export interface IDocumentAdapter {
    getDocumentSnapshot(): Promise<any>;
    applyDocumentPatch(patch: any): Promise<void>;
}