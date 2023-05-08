import { useState } from "react";
import { INeoSmallScreenProps } from "../interfaces/INeosSmallScreenProps";
import { Stack, Typography, createTheme, responsiveFontSizes, ThemeProvider, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import FromToDatePicker from "./FromToDatePicker";
import LoadingEllipsis from "../../application/components/LoadingEllipsis";

const NeoSmallScreen : React.FC<INeoSmallScreenProps> = (props) => {
    let [neosListHeight, setNeosListHeight] = useState<number>(170);
    let theme = createTheme();
    theme = responsiveFontSizes(theme);

    function onAccorditionChange(event: React.SyntheticEvent, expanded: boolean) {
        if (expanded) {
            setNeosListHeight(426);
        }
        else {
            setNeosListHeight(170);
        }
    }

    const neoHeader = <>
        <ThemeProvider theme={theme}>
            <Typography variant="h3" align="center">Near-Earth Objects</Typography>
        </ThemeProvider>
        <Accordion onChange={onAccorditionChange}>
            <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1a-content"
                id="panel1a-header"
            >
                <Typography>Set time range</Typography>
            </AccordionSummary>
            <AccordionDetails>
                <FromToDatePicker updateChart={props.refreshNeos} disabled={props.isNeoLoading}/>
            </AccordionDetails>
        </Accordion>
    </>

    if (props.errorOccured) {
        return (
        <>
            {neoHeader}
            <ThemeProvider theme={theme}>
                <Typography variant="h3" align="center">Error occured when calling API 😕</Typography>
            </ThemeProvider>
        </>
        );
    }
    else if (props.isNeoLoading) {
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
                <Stack 
                    direction="column" 
                    spacing={2} 
                    sx={{ 
                    height: `calc(100vh - ${neosListHeight}px);`, 
                    overflow: "auto",
                    border: 1, 
                    borderRadius: 1, 
                    marginTop: 1,
                    borderColor: 'grey.500'}}
                >
                    {props.neoEntries}
                </Stack>
            </>
        );
    }
}

export default NeoSmallScreen;