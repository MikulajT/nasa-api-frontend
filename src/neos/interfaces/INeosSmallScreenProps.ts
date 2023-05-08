import { Dayjs } from "dayjs";
import { INeo } from "./INeos";

export interface INeoSmallScreenProps {
    neos: INeo[];
    neoEntries: React.ReactElement[];
    errorOccured: boolean;
    isNeoLoading: boolean;
    refreshNeos(fromDate: Dayjs | null, toDate: Dayjs | null) : void
}