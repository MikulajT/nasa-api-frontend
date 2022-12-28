import { useState, useEffect } from 'react';

type Apod = {
  hdurl?: string;
  date?: string;
  copyright?: string;
  explanation?: string;
  title?: string;
};

function App() {
  const [apod, setApod] = useState<Apod>({});
  const [isApodLoaded, setIsApodLoaded] = useState<boolean>(false);
  useEffect(() => {
    fetch('http://localhost:5076/api/apod')
       .then((response) => response.json())
       .then((data) => {
          setApod(data);
          setIsApodLoaded(true);
       })
       .catch((err) => {
          console.log(err.message);
       });
 }, []);

  if (isApodLoaded) {
    return (
      <div className='container-fluid'>
      <h1 className='text-center'>Astronomy Picture of the Day</h1>
      <h2 className='text-center'>{apod.title} ({apod.date})</h2>
      <img src={apod.hdurl} className='d-block m-auto' id='apod' alt={apod.title}></img>
      <p id='explanation'>Description: {apod.explanation}</p>
      <p className='text-center'>Image copyright: {apod.copyright}</p>
      </div>
    );
  }
  else {
    return (
      <h1 className='text-center'>Loading APOD...</h1>
    );
  }
}

export default App;
