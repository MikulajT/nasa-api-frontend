import { Dayjs } from "dayjs";
import { INeo } from "./INeo";

export interface INeoSmallScreenProps {
    neos: INeo[];
    neoEntries: React.ReactElement[];
    errorOccured: boolean;
    isNeoLoaded: boolean;
    refreshNeos(fromDate: Dayjs | null, toDate: Dayjs | null) : void
}