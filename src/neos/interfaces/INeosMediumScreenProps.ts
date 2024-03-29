import { ActiveElement, ChartEvent } from "chart.js";
import { Dayjs } from "dayjs";
import { IBubbleIndex } from "./IBubbleIndex";
import { INeo } from "./INeos";

export interface INeoMediumScreenProps {
    neos: INeo[];
    neoEntries: React.ReactElement[];
    bubbleTooltipIndex: IBubbleIndex;
    highlightedNeoIndex: number;
    errorOccured: boolean;
    isNeoLoading: boolean;
    refreshNeos(fromDate: Dayjs | null, toDate: Dayjs | null) : void
    handleBubbleHover(e : ChartEvent, items : ActiveElement[]) : void
}