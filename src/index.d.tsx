import {ChartType} from "chart.js";

declare module "chart.js" {
  interface PluginOptionsByType<TType extends ChartType> {
    bubbleOutline?: {
      lineColor?: string
    };
  }
}