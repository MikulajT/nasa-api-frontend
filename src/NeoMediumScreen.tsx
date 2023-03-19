import { useRef, useEffect } from "react";
import { Box } from "@mui/system";
import { Stack, Grid, Typography } from "@mui/material";
import NeosBubbleChart from "./NeosBubbleChart";
import FromToDatePicker from "./FromToDatePicker";
import LoadingEllipsis from "./LoadingEllipsis";
import { INeoMediumScreenProps } from "./interfaces/INeoMediumScreenProps";

const NeoMediumScreen : React.FC<INeoMediumScreenProps> = (props) => {
    const neoListRef = useRef<HTMLElement>();

    useEffect(() => {
        if (props.highlightedNeoIndex !== -1) {
            neoListRef.current?.children[props.highlightedNeoIndex].scrollIntoView();
        }
    });

    const neoHeader = <>
        <Typography variant="h2" align="center">Near-Earth Objects</Typography>
        <FromToDatePicker updateChart={props.refreshNeos}/>
    </>

    if (props.errorOccured) {
        return (
        <>
            {neoHeader}
            <Typography variant="h2" align="center">Error occured when calling API 😕</Typography>
        </>
        );
    }
    else if (!props.isNeoLoaded) {
        return (
        <>
            {neoHeader}
            <LoadingEllipsis/>
        </>
        );
    }
    else {
        return (
            <>
                {neoHeader}
                <Grid container spacing={2}>
                    <Grid item xs={3}>
                        <Stack 
                            direction="column" 
                            spacing={2} 
                            sx={{ 
                            height: "70vh", 
                            overflow: "auto",
                            marginRight: 1, 
                            border: 1, 
                            borderRadius: 1, 
                            borderColor: 'grey.500'}}
                            ref={neoListRef}>
                            {props.neoEntries}
                        </Stack>
                    </Grid>
                        <Grid item xs={9}>
                            <Box>
                                <NeosBubbleChart neos={props.neos} bubbleTooltipIndex={props.bubbleTooltipIndex} handleBubbleHover={props.handleBubbleHover}/>
                            </Box>
                    </Grid>
                </Grid> 
            </>
        );
    }
}

export default NeoMediumScreen;