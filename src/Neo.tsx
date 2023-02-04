import { useState, useEffect } from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
  TimeScale
} from 'chart.js';
import type { ChartOptions } from 'chart.js';
import { Bubble } from 'react-chartjs-2';
import { Typography } from '@mui/material';
import LoadingEllipsis from './LoadingEllipsis';
import 'chartjs-adapter-moment';

interface INeo {
  x: string;
  y: number;
  r: number;
  isPotentiallyHazardousAsteroid: boolean;
  name: string;
};

interface INeoApiResponse {
  name: string;
  closeApproachDateFull: string;
  missDistance: number;
  estimatedDiameter: number;
  isPotentiallyHazardousAsteroid: boolean;
}

ChartJS.register(TimeScale, LinearScale, PointElement, Tooltip, Legend);

export const options: ChartOptions<'bubble'> = {
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
    plugins: {
        tooltip: {
            callbacks: {
                label: function(context) {
                    const neo = context.raw as INeo;
                    const labelText: string[] = [`Name: ${neo.name}`, `Date: ${neo.x}`, `Distance from Earth: ${neo.y} (km)`];
                    return labelText;
                }
            }
        }
    }
};

const Neo = () => {
  const emptyNeo = [] as INeo[];
  const [neo, setNeo] = useState<INeo[]>(emptyNeo);
  const [isNeoLoaded, setIsNeoLoaded] = useState<boolean>(false);
  const [errorOccured, setErrorOccured] = useState<boolean>(false);
  const data = {
    datasets: [
    {
      label: 'Potentionally hazardous',
      data: neo.filter((obj) => {
        return obj.isPotentiallyHazardousAsteroid;
      }),
      backgroundColor: 'rgb(255, 99, 132)'
    },
    {
      label: 'Not hazardous',
      data: neo.filter((obj) => 
      {
        return !obj.isPotentiallyHazardousAsteroid;
      }),
      backgroundColor: 'rgb(25, 25, 112)',
    },
  ]

  };
  useEffect(() => {
    async function fetchNeo() {
      let response = await fetch('http://localhost:5076/api/neo');
      if (response.ok) {
        const data : INeoApiResponse[] = await response.json();
        const neos : INeo[] = data.map(obj => (
          { 
            x: obj.closeApproachDateFull,
            y: obj.missDistance,
            r: obj.estimatedDiameter,
            isPotentiallyHazardousAsteroid: obj.isPotentiallyHazardousAsteroid,  
            name: obj.name    
          }
          ))
        setIsNeoLoaded(true);
        setNeo(neos);
      }
      else {
        setErrorOccured(true);
      }
    }
    fetchNeo();
  }, []);

  if (errorOccured) {
    return (
      <Typography variant='h2' align='center'>Error occured when calling API 😕</Typography>
    );
  }
  else if (!isNeoLoaded) {
    return (
      <LoadingEllipsis/>
    );
  }
  else {
    return(
      <>
        <Typography variant='h2' align='center'>Near-Earth Objects</Typography>
        <Bubble options={options} data={data} />
      </>
    );
  }
};
  
export default Neo;