export interface RowData {
    name: string;
    value: string | RowData[];
    secondaryValue?: string;
    handlerType?: string;
}