import { ActiveElement, ChartEvent } from "chart.js";
import { INeo } from "./INeos"
import { IBubbleIndex } from "./IBubbleIndex";

export interface INeosBubbleChartProps {
    neos: INeo[];
    bubbleTooltipIndex: IBubbleIndex;
    handleBubbleHover(e : ChartEvent, items : ActiveElement[]): void
}