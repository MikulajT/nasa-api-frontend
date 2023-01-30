import { useState, useEffect } from 'react';
import LoadingEllipsis from './LoadingEllipsis';

//TODO: Check if code works after changing type to interface
interface Apod {
  hdurl: string;
  date: string;
  copyright: string;
  explanation: string;
  title: string;
};

function App() {
  const emptyApod = {} as Apod;
  const [apod, setApod] = useState<Apod>(emptyApod);
  const [isApodLoaded, setIsApodLoaded] = useState<boolean>(false);
  const [errorOccured, setErrorOccured] = useState<boolean>(false);
  useEffect(() => {
    async function fetchApod() {
      let response = await fetch('http://localhost:5076/api/apod');
      if (response.ok) {
        const data : Apod = await response.json();
        setIsApodLoaded(true);
        setApod(data);
      }
      else {
        setErrorOccured(true);
      }
    }
    fetchApod();
  }, []);

  if (errorOccured) {
    return (
      <h1 className='mt-2 text-center'>Error occured when calling API 😕</h1>
    );
  }
  else if (!isApodLoaded) {
    return (
      <LoadingEllipsis/>
    );
  }
  else {
    return (
        <div className='container-fluid'>
            <h1 className='text-center'>Astronomy Picture of the Day</h1>
            <h2 className='text-center'>{apod.title} ({apod.date})</h2>
            <img src={apod.hdurl} className='d-block m-auto' id='apod' alt={apod.title}></img>
            <p id='explanation'><b>Description:</b> {apod.explanation}</p>
            <p className='text-center'>Image copyright: {apod.copyright}</p>
        </div>
    );
  } 
}

export default App;
