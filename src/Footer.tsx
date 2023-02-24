import { Box, Typography, Link } from '@mui/material';

export default function Footer() {
    return (
        <Box sx={{ borderTop: 1, borderColor: "grey.500", bgcolor: "#2B333D", color: "white" }}>
            <Typography variant="body1" align="center">This web uses&nbsp;
                <Link href="https://api.nasa.gov/" sx={{color: "#DB362D", textDecoration: "none"}}>
                    NASA APIs
                </Link>
            </Typography>
        </Box>
    );
}