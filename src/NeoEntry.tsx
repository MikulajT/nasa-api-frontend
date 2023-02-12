import { Typography, Box, Tooltip } from '@mui/material';

interface ChildProps {
    index: number,
    name: string,
    date: string,
    distanceFromEarth: number,
    diameter: number,
    isHazardous: boolean,
    showTooltip(index: number, isHazardous: boolean): void,
    hideTooltip(): void
 }

const NeoEntry: React.FC<ChildProps> = (props) => {
    return (
        <Box 
            sx={{ border: 1, borderColor: 'text.primary', m: 0, p: 1 }} 
            onMouseEnter={() => props.showTooltip(props.index, props.isHazardous)} 
            onMouseLeave={() => props.hideTooltip()}
        >
            <Typography variant="body1">
                Name: {props.name}
            </Typography>
            <Typography variant="body1">
                Date: {props.date}
            </Typography>
            <Tooltip title="Distance from earth">
                <Typography variant="body1" sx={{display: 'inline'}}>
                    DFE: 
                </Typography>
            </Tooltip> 
            <Typography variant="body1" sx={{display: 'inline'}}>
                    {props.distanceFromEarth} km
            </Typography>
            <Typography variant="body1">
                Diameter: {props.diameter} km
            </Typography>
        </Box>
      );
}

export default NeoEntry;