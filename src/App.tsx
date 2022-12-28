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
  useEffect(() => {
    fetch('http://localhost:5076/api/apod')
       .then((response) => response.json())
       .then((data) => {
          console.log(data);
          setApod(data);
       })
       .catch((err) => {
          console.log(err.message);
       });
 }, []);

  return (
    <div className="container-fluid">
      <h1>Astronomy Picture of the Day</h1>
      <h2>{apod.title} ({apod.date})</h2>
      <div>
        <img src={apod.hdurl} alt={apod.title}></img>
      </div>
      <p>{apod.explanation}</p>
      <p>{apod.copyright}</p>
    </div>
  );
}

export default App;
