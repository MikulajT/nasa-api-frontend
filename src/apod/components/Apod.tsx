import { useState, useEffect } from "react";
import { Typography, createTheme, ThemeProvider, responsiveFontSizes } from "@mui/material";
import { Container, Box } from "@mui/system";
import Zoom from 'react-medium-image-zoom'
import 'react-medium-image-zoom/dist/styles.css'
import { IApod } from "../interfaces/IApod";
import LoadingEllipsis from "../../application/components/LoadingEllipsis";
import ".././styles/Apod.css";

function App() {
  const emptyApod = {} as IApod;
  const [apod, setApod] = useState<IApod>(emptyApod);
  const [isApodLoaded, setIsApodLoaded] = useState<boolean>(false);
  const [errorOccured, setErrorOccured] = useState<boolean>(false);
  let theme = createTheme();
  theme = responsiveFontSizes(theme);

  useEffect(() => {
    async function fetchApod() {
      let response = await fetch("http://localhost:5076/api/apod");
      if (response.ok) {
        const data : IApod = await response.json();
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
      <ThemeProvider theme={theme}>
        <Typography variant="h3" align="center">Error occured when calling API 😕</Typography>
      </ThemeProvider>
    );
  }
  else if (!isApodLoaded) {
    return (
      <LoadingEllipsis/>
    );
  }
  else {
    return (
      <Container>
        <ThemeProvider theme={theme}>
          <Typography variant="h3" align="center">Astronomy Picture of the Day</Typography>
        </ThemeProvider>
        <Typography variant="h5" align="center">{apod.title} ({apod.date})</Typography>
        <Zoom>
          <Box
            component="img"
            src={apod.hdurl}
            alt={apod.title}
            id="apod"
            m="auto"
            display="block"
          />
        </Zoom>
        <Typography variant="body1" sx={{mt: 1}}><b>Description:</b> {apod.explanation}</Typography>
        <Typography variant="body1" align="center" sx={{mt: 2}}>Image copyright: {apod.copyright}</Typography>
      </Container>
    );
  } 
}

export default App;
