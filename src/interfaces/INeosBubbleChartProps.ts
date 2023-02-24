import { ActiveElement, ChartEvent } from "chart.js";
import { INeo } from "./INeo"
import { IBubbleIndex } from "./IBubbleIndex";

export interface INeosBubbleChartProps {
    neos: INeo[];
    bubbleTooltipIndex: IBubbleIndex;
    handleBubbleHover(e : ChartEvent, items : ActiveElement[]): void
}