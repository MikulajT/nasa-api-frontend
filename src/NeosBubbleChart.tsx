import { useRef, useEffect } from 'react';
import { INeosBubbleChartProps } from "./interfaces/INeosBubbleChartProps"
import {
    Chart,
    LinearScale,
    PointElement,
    Tooltip,
    Legend,
    TimeScale,
    ChartOptions,
    TooltipModel,
    ChartArea
  } from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { bubbleOutline } from './chartJsPlugins/BubbleOutline';
import { INeo } from "./interfaces/INeo";

const NeosBubbleChart: React.FC<INeosBubbleChartProps> = (props) => {  
    const chartRef = useRef<Chart>();
    Chart.register(TimeScale, LinearScale, PointElement, Tooltip, Legend, bubbleOutline);

    useEffect(() => {
        if (props.bubbleTooltipIndex.datasetIndex !== -1 && props.bubbleTooltipIndex.index !== -1) {
            const tooltip = chartRef.current?.tooltip as TooltipModel;
            const chartArea = chartRef.current?.chartArea as ChartArea;
            tooltip.setActiveElements([
                {
                datasetIndex: props.bubbleTooltipIndex.datasetIndex,
                index: props.bubbleTooltipIndex.index,
                }
            ],
            {
                x: (chartArea.left + chartArea.right) / 2,
                y: (chartArea.top + chartArea.bottom) / 2,
            });
            chartRef.current?.update();
        }
        else {
            const tooltip = chartRef.current?.tooltip as TooltipModel;
            tooltip.setActiveElements([], {x: 0, y: 0});
            chartRef.current?.update();
        }
    }, [props.bubbleTooltipIndex]);

    const options: ChartOptions<'bubble'> = {
        scales: {
        x: {
            type: 'time',
            time: {
            unit: 'day'
            },
            title: {
            display: true,
            text: 'Date',
            font: {
                size: 16,
            }
            }
        },
        y: {
            beginAtZero: true,
            title: {
            display: true,
            text: 'Distance from Earth (km)',
            font: {
                size: 16,
            }
            }
        }
        },
        onHover: props.handleBubbleHover,
        plugins: {
            tooltip: {
                callbacks: {
                    label: function(context) {
                        const neo = context.raw as INeo;
                        const labelText: string[] = [`Name: ${neo.name}`, `Date: ${neo.x}`, `Distance from Earth: ${neo.y} (km)`];
                        return labelText;
                    }
                }
            },
            bubbleOutline: {
                lineColor: "black",
            }
        }
    };

    const data = {
        datasets: [
            {
            label: 'Potentionally hazardous',
            data: props.neos.filter((obj) => {
                return obj.isPotentiallyHazardousAsteroid;
            }),
            backgroundColor: 'rgb(255, 99, 132)',
            hitRadius: 10
            },
            {
            label: 'Not hazardous',
            data: props.neos.filter((obj) => 
            {
                return !obj.isPotentiallyHazardousAsteroid;
            }),
            backgroundColor: 'rgb(25, 25, 112)',
            hitRadius: 10
            },
        ]
    };

    return (
    <Bubble options={options} data={data} ref={chartRef} />
    );
}

export default NeosBubbleChart;