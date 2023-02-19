import * as React from 'react';
import { Link as RouterLink} from 'react-router-dom';
import { Link } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { SvgIcon } from '@mui/material';
import { ReactComponent as NasaLogo } from './assets/nasa.svg';

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = React.useState<null | HTMLElement>(null);

  const handleOpenNavMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorElNav(event.currentTarget);
  };

  function handleCloseNavMenu() {
    setAnchorElNav(null);
  };

  return (
    <AppBar position="static" sx={{ bgcolor: "#2B333D" }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          <Link href="/">
            <SvgIcon component={NasaLogo} sx={{ display: { xs: 'none', md: 'flex', fontSize: 60 }, mr: 1 }} inheritViewBox />
          </Link>
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem onClick={handleCloseNavMenu}>
                <Link href="/apod" sx={{color: 'black'}} textAlign="center" underline='none'>APOD</Link>
              </MenuItem>
              <MenuItem onClick={handleCloseNavMenu}>
                <Link href="/neo" sx={{color: 'black'}} textAlign="center" underline='none'>NEO</Link>
              </MenuItem>
            </Menu>
          </Box>
          <Link href="/">
            <SvgIcon component={NasaLogo} sx={{ display: { xs: 'flex', md: 'none' }, mr: 1, fontSize: 60 }}  inheritViewBox />
          </Link>   
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          <Button
            component={RouterLink} 
            to="/apod"
            onClick={handleCloseNavMenu}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            APOD
          </Button>
          <Button
            component={RouterLink} 
            to="/neo"
            onClick={handleCloseNavMenu}
            sx={{ my: 2, color: 'white', display: 'block' }}
          >
            NEO
          </Button>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;