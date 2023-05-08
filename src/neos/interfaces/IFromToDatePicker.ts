import { Dayjs } from "dayjs";

export interface IFromToDatePicker {
    disabled: boolean;
    updateChart(fromDate: Dayjs | null, toDate?: Dayjs | null): void;
}