import { useState, useEffect } from "react";
import { Typography, 
  createTheme, 
  ThemeProvider, 
  responsiveFontSizes, 
  InputLabel, 
  MenuItem, 
  FormControl, 
  Select, 
  SelectChangeEvent, 
  TextField,
  Stack,
  Button,
  ImageList} from "@mui/material";
import { Container } from "@mui/system";
import dayjs, { Dayjs } from "dayjs";
import { DatePicker, LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { IRoverManifest } from "../interfaces/IRoverManifest";
import LoadingEllipsis from "../../application/components/LoadingEllipsis";
import RoverPhoto from "./RoverPhoto";
import { IRoverPhotoResponse } from "../interfaces/IRoverPhotoResponse";

function Mrp() {
  const [roverPhotos, setRoverPhotos] = useState<IRoverPhotoResponse[]>([] as IRoverPhotoResponse[]);
  const [photosAreLoading, setphotosAreLoading] = useState<boolean>(false);
  const [manifestIsLoading, setManifestIsLoading] = useState<boolean>(true);
  const [errorOccured, setErrorOccured] = useState<boolean>(false);
  const [selectedRoverId, setSelectedRoverId] = useState<"5" | "6" | "7" | "8">("5");
  const [selectedCameraId, setSelectedCameraId] = useState<string>("ALL");
  const [roverPhotoDate, setRoverPhotoDate] = useState<Dayjs | null>(null);
  const [maxDate, setMaxDate] = useState<Dayjs | null>(null);
  const roverToCamerasMapping = {
    "5": [
      { "id": "FHAZ", "value": "Front Hazard Avoidance Camera" },
      { "id": "RHAZ", "value": "Rear Hazard Avoidance Camera" },
      { "id": "MAST", "value": "Mast Camera" },
      { "id": "CHEMCAM", "value": "Chemistry and Camera Complex" },
      { "id": "MAHLI", "value": "Mars Hand Lens Imager" },
      { "id": "MARDI", "value": "Mars Descent Imager" },
      { "id": "NAVCAM", "value": "Navigation Camera" }
    ],
     "6": [
      { "id": "FHAZ", "value": "Front Hazard Avoidance Camera" },
      { "id": "RHAZ", "value": "Rear Hazard Avoidance Camera" },
      { "id": "NAVCAM", "value": "Navigation Camera" },
      { "id": "PANCAM", "value": "Panoramic Camera" },
      { "id": "MINITES", "value": "	Miniature Thermal Emission Spectrometer" }
     ],
     "7": [
      { "id": "FHAZ", "value": "Front Hazard Avoidance Camera" },
      { "id": "RHAZ", "value": "Rear Hazard Avoidance Camera" },
      { "id": "NAVCAM", "value": "Navigation Camera" },
      { "id": "PANCAM", "value": "Panoramic Camera" },
      { "id": "MINITES", "value": "Miniature Thermal Emission Spectrometer" }
     ],
     "8": [
      { "id": "EDL_RUCAM", "value": "Rover Up-Look Camera" },
      { "id": "EDL_RDCAM", "value": "Rover Down-Look Camera" },
      { "id": "EDL_DDCAM", "value": "Descent Stage Down-Look Camera" },
      { "id": "EDL_PUCAM1", "value": "Parachute Up-Look Camera A" },
      { "id": "EDL_PUCAM2", "value": "Parachute Up-Look Camera B" },
      { "id": "NAVCAM_LEFT", "value": "Navigation Camera - Left" },
      { "id": "NAVCAM_RIGHT", "value": "Navigation Camera - Right" },
      { "id": "MCZ_RIGHT", "value": "Mast Camera Zoom - Right" },
      { "id": "MCZ_LEFT", "value": "Mast Camera Zoom - Left" },
      { "id": "FRONT_HAZCAM_LEFT_A", "value": "Front Hazard Avoidance Camera - Left" },
      { "id": "FRONT_HAZCAM_RIGHT_A", "value": "Front Hazard Avoidance Camera - Right" },
      { "id": "REAR_HAZCAM_LEFT", "value": "Rear Hazard Avoidance Camera - Left" },
      { "id": "REAR_HAZCAM_RIGHT", "value": "Rear Hazard Avoidance Camera - Right" },
      { "id": "SKYCAM", "value": "MEDA Skycam" },
      { "id": "SHERLOC_WATSON", "value": "SHERLOC WATSON Camera" }
     ],
  };
  let theme = createTheme();
  theme = responsiveFontSizes(theme);

  useEffect(() => {
    fetchRoverManifest();
  }, [selectedRoverId]);

  async function fetchRoverManifest() {
    setManifestIsLoading(true);
    let response = await fetch(`http://localhost:5076/api/MarsRover/RoverManifest?roverId=${selectedRoverId}&camera=${selectedCameraId}`);
    if (response.ok) {
      setManifestIsLoading(false);
      const data : IRoverManifest = await response.json();
      setMaxDate(dayjs(data.maxDate));
      setRoverPhotoDate(dayjs(data.maxDate));
    }
    else {
      setManifestIsLoading(false);
      setErrorOccured(true);
    }
  }

  function handleRoverChange(event: SelectChangeEvent) {
    setSelectedRoverId(event.target.value as "5" | "6" | "7" | "8");
  }

  function handleCameraChange(event: SelectChangeEvent) {
    setSelectedCameraId(event.target.value);
  }

  function GetRoverCamerasByRover(roverId: "5" | "6" | "7" | "8") : React.ReactElement[] {
    let roverCameras : React.ReactElement[] = [];
    roverCameras.push(<MenuItem key="ALL" value="ALL"><em>All cameras</em></MenuItem>);
    for (var camera of roverToCamerasMapping[roverId]) {
      roverCameras.push(<MenuItem key={camera.id} value={camera.id}>{camera.value}</MenuItem>)
    }
    return roverCameras;
  }

  async function RefreshRoverPhotos() {
    setphotosAreLoading(true);
    let response = await fetch(`http://localhost:5076/api/MarsRover/RoverPhotos?roverId=${selectedRoverId}&date=${roverPhotoDate}&camera=${selectedCameraId}`);
    if (response.ok) {
      const data : IRoverPhotoResponse[] = await response.json();
      setphotosAreLoading(false);
      setErrorOccured(false);
      setRoverPhotos(data);
    }
    else {
      setErrorOccured(true);
    }
  }

  function CreatePhotoList() : React.ReactElement[] {
    const roverPhotoList: React.ReactElement[] = [];
    for (let i = 0; i < roverPhotos.length; i++) {
      roverPhotoList.push(
        <RoverPhoto key={roverPhotos[i].id} cameraName={roverPhotos[i].cameraName} imgSrc={roverPhotos[i].imgSrc}/>);
    }
    return roverPhotoList;
  }

  const imageList = <ImageList sx={{ width: "90%", height: 700 }} cols={3} rowHeight={164}>
                      {CreatePhotoList()}
                    </ImageList>;

  if (errorOccured) {
    return (
      <ThemeProvider theme={theme}>
        <Typography variant="h3" align="center">Error occured when calling API 😕</Typography>
      </ThemeProvider>
    );
  }
  else {
    return (
      <Container>
        <ThemeProvider theme={theme}>
          <Typography variant="h3" align="center">Mars rover photos</Typography>
        </ThemeProvider>
        <Stack 
          direction="row" 
          spacing={2} 
          justifyContent="center" 
          sx={{m: 2, pointerEvents: manifestIsLoading || photosAreLoading ? "none" : "auto"}}>
          <FormControl>
            <InputLabel id="roverSelectLabel">Rover</InputLabel>
            <Select
              labelId="roverSelectLabel"
              id="roverSelect"
              value={selectedRoverId}
              label="Rover"
              onChange={handleRoverChange}
            >
              <MenuItem key="cur" value={5}>Curiosity</MenuItem>
              <MenuItem key="opp" value={6}>Opportunity</MenuItem>
              <MenuItem key="spi" value={7}>Spirit</MenuItem>
              <MenuItem key="per" value={8}>Perseverance</MenuItem>
            </Select>
          </FormControl>
          <FormControl>
            <LocalizationProvider dateAdapter={AdapterDayjs}>       
              <DatePicker
                label="Date"
                inputFormat="DD-MM-YYYY"
                value={roverPhotoDate}
                maxDate={maxDate}
                onChange={(newValue) => setRoverPhotoDate(newValue)}
                renderInput={(params) => <TextField {...params} />}
              />
            </LocalizationProvider>
          </FormControl>
          <FormControl>
            <InputLabel id="cameraSelectLabel">Rover camera</InputLabel>
            <Select
              labelId="cameraSelectLabel"
              id="cameraSelect"
              value={selectedCameraId}
              label="Rover camera"
              onChange={handleCameraChange}
            >
              {GetRoverCamerasByRover(selectedRoverId)}
            </Select> 
          </FormControl>
          <Button variant="contained" onClick={RefreshRoverPhotos}>Refresh</Button>
        </Stack>
        {manifestIsLoading || photosAreLoading ? <LoadingEllipsis/> : imageList}
      </Container>
    );
  } 
}

export default Mrp;