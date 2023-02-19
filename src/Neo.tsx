import { useState, useEffect, useRef, ReactElement} from 'react';
import { flushSync } from 'react-dom'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs  } from '@mui/x-date-pickers/AdapterDayjs';
import { DesktopDatePicker } from '@mui/x-date-pickers/DesktopDatePicker';
import dayjs, { Dayjs } from 'dayjs';
import {TextField, Stack, Button, Container} from '@mui/material';
import {
  Chart,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale,
  ActiveElement
} from 'chart.js';
import type { ChartOptions, TooltipModel, ChartArea } from 'chart.js';
import { horizontalArbitraryLine } from './ChartJsPluhgins/HorizontalArbitraryLine';
import { Bubble } from 'react-chartjs-2';
import { Typography } from '@mui/material';
import LoadingEllipsis from './LoadingEllipsis';
import NeoEntry from './NeoEntry';
import 'chartjs-adapter-moment';
import { Box } from '@mui/system';

interface INeo {
  x: string;
  y: number;
  r: number;
  isPotentiallyHazardousAsteroid: boolean;
  name: string;
  neoEntryIndex: number;
};

interface INeoApiResponse {
  name: string;
  closeApproachDateFull: string;
  missDistance: number;
  estimatedDiameter: number;
  isPotentiallyHazardousAsteroid: boolean;
}

const Neo = () => {
  const chartRef = useRef<Chart>();
  const neoListRef = useRef<HTMLElement>();
  const emptyNeo = [] as INeo[];
  const [neo, setNeo] = useState<INeo[]>(emptyNeo);
  const [isNeoLoaded, setIsNeoLoaded] = useState<boolean>(false);
  const [errorOccured, setErrorOccured] = useState<boolean>(false);
  const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs());
  const [toDate, setToDate] = useState<Dayjs | null>(dayjs());
  const [isErrorDate, setIsErrorDate] = useState<boolean>(false);
  const [highlightedNeoIndex, setHighlightedNeoIndex] = useState<number>(-1);

  Chart.register(TimeScale, LinearScale, PointElement, Tooltip, Legend, horizontalArbitraryLine);

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
    onHover: function (e, items : ActiveElement[]) {
      if (items.length == 1) {

        //Casting to any is not a good practise (it avoids features which TS provides)
        const activeElement = items[0].element as any;

        const bubbleData = activeElement.$context.raw as INeo; 
        neoListRef.current?.children[bubbleData.neoEntryIndex].scrollIntoView();
        flushSync(() => {
          setHighlightedNeoIndex(bubbleData.neoEntryIndex);
        })
      }
      else if (highlightedNeoIndex != -1) {
        setHighlightedNeoIndex(-1);
      }
    },
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
          horizontalArbitraryLine: {
            lineColor: "black",
        }
      }
  };

  const data = {
    datasets: [
    {
      label: 'Potentionally hazardous',
      data: neo.filter((obj) => {
        return obj.isPotentiallyHazardousAsteroid;
      }),
      backgroundColor: 'rgb(255, 99, 132)',
      hitRadius: 10
    },
    {
      label: 'Not hazardous',
      data: neo.filter((obj) => 
      {
        return !obj.isPotentiallyHazardousAsteroid;
      }),
      backgroundColor: 'rgb(25, 25, 112)',
      hitRadius: 10
    },
  ]
  };

  useEffect(() => {
    fetchNeo();
  }, []);

  async function fetchNeo() {
    setIsNeoLoaded(false);
    let response = await fetch(`http://localhost:5076/api/neo?startDate=${fromDate?.format('MM-DD-YYYY')}&endDate=${toDate?.format('MM-DD-YYYY')}`);
    if (response.ok) {
      const data : INeoApiResponse[] = await response.json();
      const neos : INeo[] = data.map((obj, index) => (
        { 
          x: obj.closeApproachDateFull,
          y: obj.missDistance,
          r: obj.estimatedDiameter,
          isPotentiallyHazardousAsteroid: obj.isPotentiallyHazardousAsteroid,  
          name: obj.name,
          neoEntryIndex: index
        }
        ))
      setIsNeoLoaded(true);
      setErrorOccured(false);
      setNeo(neos);
    }
    else {
      setErrorOccured(true);
    }
  }

  function handleFromDateChange(newValue: Dayjs | null) {
    setFromDate(newValue);
  };

  function handleToDateChange(newValue: Dayjs | null) {
    setToDate(newValue);
  };

  function updateChart() {
    fetchNeo();
  }

  function showTooltip(neoIndex: number, isHazardous: boolean) {
    const tooltip = chartRef.current?.tooltip as TooltipModel;
    const chartArea = chartRef.current?.chartArea as ChartArea;
    tooltip.setActiveElements([
      {
        datasetIndex: isHazardous ? 0 : 1,
        index: neoIndex,
      }
    ],
    {
      x: (chartArea.left + chartArea.right) / 2,
      y: (chartArea.top + chartArea.bottom) / 2,
    });
    chartRef.current?.update();
  }

  function hideTooltip() {
    const tooltip = chartRef.current?.tooltip as TooltipModel;
    tooltip.setActiveElements([], {x: 0, y: 0});
    chartRef.current?.update();
  }

  function createNeoList() : React.ReactElement[] {
    const neoList: React.ReactElement[] = [];
    let hazardousNeoIndex = 0;
    let notHazardousNeoIndex = 0;
    for (let i = 0; i < neo.length; i++) {
      let neoIndex = neo[i].isPotentiallyHazardousAsteroid ? hazardousNeoIndex++ : notHazardousNeoIndex++;
      neoList.push(
      <NeoEntry 
        key={i} 
        index={neoIndex} 
        name={neo[i].name} 
        date={neo[i].x} 
        distanceFromEarth={neo[i].y }
        diameter={neo[i].r} 
        isHazardous={neo[i].isPotentiallyHazardousAsteroid}
        highlightTooltip={i == highlightedNeoIndex}
        showTooltip={showTooltip}
        hideTooltip={hideTooltip}
      />);
    }
    return neoList;
  }

  const neoHeader = <>
    <Typography variant='h2' align='center'>Near-Earth Objects</Typography>
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Stack direction="row" justifyContent='center' spacing={4} sx={{mt: 2, mb: 2}}>
        <DesktopDatePicker
          label="From"
          inputFormat="DD-MM-YYYY"
          value={fromDate}
          maxDate={toDate!} // Doesn't work
          onChange={handleFromDateChange}
          renderInput={(params) => <TextField {...params} />}
        />
        <DesktopDatePicker
          label="To"
          inputFormat="DD-MM-YYYY"
          value={toDate}
          minDate={fromDate!} // Doesn't work
          maxDate={fromDate?.add(6, 'day')} // Doesn't work
          onChange={handleToDateChange}
          onError={(reason, value) => {
            if (reason) {
              setIsErrorDate(true);
            } else {
              setIsErrorDate(false);
            }
          }}
          renderInput={(params) => 
          <TextField 
            {...params} 
            error={isErrorDate} 
            helperText= {isErrorDate ? "Maximum timespan between from and to date is 7 days" : ""} 
          />}
        />
        <Button variant="contained" onClick={updateChart}>Refresh</Button>
      </Stack>
    </LocalizationProvider>
  </>

  if (errorOccured) {
    return (
      <>
        {neoHeader}
        <Typography variant='h2' align='center'>Error occured when calling API 😕</Typography>
      </>
    );
  }
  else if (!isNeoLoaded) {
    return (
      <>
        {neoHeader}
        <LoadingEllipsis/>
      </>
    );
  }
  else {
    return(
      <>
        {neoHeader}
        <Container maxWidth="xl">
          <Stack direction="row">
            <Stack direction="column" spacing={2} sx={{width: '20vw', height: '70vh', overflow: 'auto'}} ref={neoListRef}>
              {createNeoList()}
            </Stack>
            <Box sx={{width: '70vw'}}>
              <Bubble options={options} data={data} ref={chartRef} />
            </Box>
          </Stack>
        </Container>
      </>
    );
  }
};
  
export default Neo;