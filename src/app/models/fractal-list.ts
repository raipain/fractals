import { IFractalConfiguration } from './fractal-conf';

export interface IFractalList {
    name: string;
    previewId: string;
    preview: any;
    algorithm: any;
    configurations: IFractalConfiguration[];
}