export interface IAlgorithmConfiguration {
    name: string;
    type?: string;
    value?: number;
    color?: string;
    maxValue?: number;
    minValue?: number;
    step?: number;
    func?: Function;
    values?: IAlgorithmConfiguration[];
    configurations?: IAlgorithmConfiguration[];
}
