import { Typography, Box, Tooltip, Link } from "@mui/material";
import dayjs  from "dayjs";
import { INeoEntryProps } from "../interfaces/INeoEntryProps";
import ".././styles/NeoEntry.css";

const NeoEntry: React.FC<INeoEntryProps> = (props) => {

    function getNeoLink(neoName: string) : string {
        const neoNameWithoutCommas = neoName.slice(1,-1);
        const encodedNeoName = encodeURIComponent(neoNameWithoutCommas);
        return `https://ssd.jpl.nasa.gov/tools/sbdb_lookup.html#/?sstr=${encodedNeoName}&view=VOP`;
    }

    return (
        <Box 
            className={`m-1 p-1 box-border ${props.isHazardous ? "left-pink-corner" : "left-blue-corner"} ${props.highlightTooltip ? "box-shadow" : ""}`}
            sx={{ border: 1, borderColor: "text.primary", p: 1 }} 
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
                Date: {dayjs(props.date).format('DD/MM/YYYY HH:mm:ss')}
            </Typography>
            <Tooltip title="Distance from earth">
                <Typography variant="body1" sx={{display: "inline"}}>
                    DFE:&nbsp; 
                </Typography>
            </Tooltip> 
            <Typography variant="body1" sx={{display: "inline"}}>
                    {props.distanceFromEarth} km
            </Typography>
            <Typography variant="body1">
                Diameter: {props.diameter * 1000} m
            </Typography>
        </Box>
      );
}

export default NeoEntry;