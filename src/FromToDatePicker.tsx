import { useState } from "react";
import {TextField, Stack, Button} from "@mui/material";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs  } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers";
import dayjs, { Dayjs } from "dayjs";
import { IFromToDatePicker } from "./interfaces/IFromToDatePicker";

const FromToDatePicker: React.FC<IFromToDatePicker> = (props) => {
    const [fromDate, setFromDate] = useState<Dayjs | null>(dayjs());
    const [toDate, setToDate] = useState<Dayjs | null>(dayjs());
    const [isErrorDate, setIsErrorDate] = useState<boolean>(false);

    return (
        <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Stack 
          direction={{ xs: "column", sm: "row" }}
          justifyContent="center" 
          spacing={{ xs: 1, sm: 2, md: 4 }} 
          sx={{mt: 2, mb: 2}}
        >
          <DatePicker
            label="From"
            inputFormat="DD-MM-YYYY"
            value={fromDate}
            maxDate={toDate!}
            onChange={(newValue) => setFromDate(newValue)}
            renderInput={(params) => <TextField {...params} />}
          />
          <DatePicker
            label="To"
            inputFormat="DD-MM-YYYY"
            value={toDate}
            minDate={fromDate!}
            maxDate={fromDate?.add(6, "day")}
            onChange={(newValue) => setToDate(newValue)}
            onError={(reason) => {
              if (reason) {
                setIsErrorDate(true);
              } else {
                setIsErrorDate(false);
              }
            }}
            renderInput={(params) => 
            <TextField 
              {...params} 
              error={isErrorDate} 
              helperText= {isErrorDate ? "Maximum timespan between from and to date is 7 days" : ""} 
            />}
          />  
          <Button variant="contained" disabled={isErrorDate} sx={{height: "56px"}} onClick={() => props.updateChart(fromDate, toDate)}>Refresh</Button>    
        </Stack>
      </LocalizationProvider>
    ); 
}

export default FromToDatePicker;