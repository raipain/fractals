export interface IAlgorithmConfiguration {
    name: string;
    type?: string;
    value?: number;
    color?: string;
    maxValue?: number;
    minValue?: number;
    step?: number;
    default?: boolean;
    func?: Function;
    values?: IAlgorithmConfiguration[];
    configurations?: IAlgorithmConfiguration[];
    bind?: any;
}
