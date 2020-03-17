import { IAlgorithmConfiguration } from './algorithm-configuration';

export interface IAlgorithmList {
    name: string;
    previewId: string;
    preview: any;
    algorithm: any;
    configurations: IAlgorithmConfiguration[];
    about?: string;
}