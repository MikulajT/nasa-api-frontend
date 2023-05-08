import { Box } from '@mui/material';
import Zoom from 'react-medium-image-zoom'
import { IRoverPhotoProps } from "../interfaces/IRoverPhotoProps";


const RoverPhoto : React.FC<IRoverPhotoProps> = (props) => {
  return (
    <Zoom>
      <Box>
      <img
        src={props.imgSrc}
        alt={`Photo from ${props.cameraName} camera`}
        width="100%"
        loading="lazy"
      />
      </Box>
    </Zoom>
    );
}

export default RoverPhoto;