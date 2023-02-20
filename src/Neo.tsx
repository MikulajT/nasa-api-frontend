import { useState, useRef } from 'react';
import { flushSync } from 'react-dom'
import { Stack, Container } from '@mui/material';
import { ActiveElement, ChartEvent } from 'chart.js';
import { Typography } from '@mui/material';
import 'chartjs-adapter-moment';
import { Box } from '@mui/system';
import { Dayjs } from 'dayjs';
import LoadingEllipsis from './LoadingEllipsis';
import NeoEntry from './NeoEntry';
import FromToDatePicker from './FromToDatePicker';
import { INeo } from './interfaces/INeo';
import { INeoApiResponse } from './interfaces/INeoApiResponse';
import { IBubbleIndex } from './interfaces/IBubbleIndex';
import NeosBubbleChart from './NeosBubbleChart';

function Neo() {
  const neoListRef = useRef<HTMLElement>();
  const [neos, setNeos] = useState<INeo[]>([] as INeo[]);
  const [isNeoLoaded, setIsNeoLoaded] = useState<boolean>(true);
  const [errorOccured, setErrorOccured] = useState<boolean>(false);
  const [highlightedNeoIndex, setHighlightedNeoIndex] = useState<number>(-1);
  const [bubbleTooltipIndex, setBubbleTooltipIndex] = useState<IBubbleIndex>({datasetIndex: -1, index: -1});

  async function fetchNeo(fromDate: Dayjs | null, toDate: Dayjs | null) {
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
      setNeos(neos);
    }
    else {
      setErrorOccured(true);
    }
  }

  function updateChart(fromDate: Dayjs | null, toDate: Dayjs | null) {
    fetchNeo(fromDate, toDate);
  }

  function handleBubbleHover(e : ChartEvent, items : ActiveElement[]) {
    if (items.length === 1) {

      //Casting to any is not a good practise (it avoids features which TS provides)
      const activeElement = items[0].element as any;

      const bubbleData = activeElement.$context.raw as INeo; 
      neoListRef.current?.children[bubbleData.neoEntryIndex].scrollIntoView();
      flushSync(() => {
        setHighlightedNeoIndex(bubbleData.neoEntryIndex);
      })
    }
    else if (highlightedNeoIndex !== -1) {
      setHighlightedNeoIndex(-1);
    }
  }

  function showTooltip(neoIndex: number, isHazardous: boolean) {
    setBubbleTooltipIndex({datasetIndex: isHazardous ? 0 : 1, index: neoIndex});
  }

  function hideTooltip() {
    setBubbleTooltipIndex({datasetIndex: -1, index: -1});
  }

  function createNeoList() : React.ReactElement[] {
    const neoList: React.ReactElement[] = [];
    let hazardousNeoIndex = 0;
    let notHazardousNeoIndex = 0;
    for (let i = 0; i < neos.length; i++) {
      let neoIndex = neos[i].isPotentiallyHazardousAsteroid ? hazardousNeoIndex++ : notHazardousNeoIndex++;
      neoList.push(
      <NeoEntry 
        key={i} 
        index={neoIndex} 
        name={neos[i].name} 
        date={neos[i].x} 
        distanceFromEarth={neos[i].y }
        diameter={neos[i].r} 
        isHazardous={neos[i].isPotentiallyHazardousAsteroid}
        highlightTooltip={i === highlightedNeoIndex}
        showTooltip={showTooltip}
        hideTooltip={hideTooltip}
      />);
    }
    return neoList;
  }

  const neoHeader = <>
    <Typography variant='h2' align='center'>Near-Earth Objects</Typography>
    <FromToDatePicker updateChart={updateChart}/>
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
              <NeosBubbleChart neos={neos} bubbleTooltipIndex={bubbleTooltipIndex} handleBubbleHover={handleBubbleHover}/>
            </Box>
          </Stack>
        </Container>
      </>
    );
  }
};
  
export default Neo;