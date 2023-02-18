import { Typography, Box, Tooltip, Link } from '@mui/material';

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

    function getNeoLink(neoName: string) : string {
        const neoNameWithoutCommas = neoName.slice(1,-1);
        const encodedNeoName = encodeURIComponent(neoNameWithoutCommas);
        return `https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${encodedNeoName}&view=VOP`;
    }

    return (
        <Box 
            className={`box-border ${props.isHazardous ? "left-pink-corner" : "left-blue-corner"}`}
            sx={{ border: 1, borderColor: 'text.primary', m: 1, p: 1 }} 
            onMouseEnter={() => props.showTooltip(props.index, props.isHazardous)} 
            onMouseLeave={() => props.hideTooltip()}
        >
            <Typography variant="body1">
                Name:&nbsp;
                <Link href={getNeoLink(props.name)}>
                    {props.name}
                </Link>
            </Typography>
            <Typography variant="body1">
                Date: {props.date}
            </Typography>
            <Tooltip title="Distance from earth">
                <Typography variant="body1" sx={{display: 'inline'}}>
                    DFE:&nbsp; 
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