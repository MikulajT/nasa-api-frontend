import { Dayjs } from "dayjs";

export interface IFromToDatePicker {
    updateChart(fromDate: Dayjs | null, toDate?: Dayjs | null): void
}