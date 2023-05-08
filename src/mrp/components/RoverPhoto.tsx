import Zoom from 'react-medium-image-zoom'
import { v4 as uuidv4 } from 'uuid';
import { IRoverPhotoProps } from "../interfaces/IRoverPhotoProps";


const RoverPhoto : React.FC<IRoverPhotoProps> = (props) => {
  return (
    <Zoom>
      <img
        key={uuidv4()}
        src={props.imgSrc}
        alt={props.cameraName}
        loading="lazy"
      />
    </Zoom>
  );
}

export default RoverPhoto;