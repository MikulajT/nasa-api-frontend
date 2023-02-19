export interface INeoEntryChildProps {
    index: number,
    name: string,
    date: string,
    distanceFromEarth: number,
    diameter: number,
    isHazardous: boolean,
    highlightTooltip: boolean,
    showTooltip(index: number, isHazardous: boolean): void,
    hideTooltip(): void
 }