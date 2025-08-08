import React from 'react';
import { AppBar, Toolbar, Typography, Button, Box, Chip } from '@mui/material';
import { LocationOn, Business } from '@mui/icons-material';
import { useNavigate, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname === path;

  return (
    <AppBar
      position="static"
      elevation={2}
      sx={{
        background: 'linear-gradient(45deg, #1976d2 30%, #42a5f5 90%)',
      }}
    >
      <Toolbar sx={{ px: { xs: 2, sm: 3 } }}>
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            cursor: 'pointer',
            '&:hover': { opacity: 0.8 },
            transition: 'opacity 0.2s',
          }}
          onClick={() => navigate('/')}
        >
          <Business sx={{ mr: 1.5, fontSize: 28 }} />
          <Typography
            variant="h5"
            component="div"
            sx={{
              fontWeight: 700,
              letterSpacing: '-0.5px',
            }}
          >
            Joonik
          </Typography>
          <Chip
            label="Sedes"
            size="small"
            sx={{
              ml: 2,
              backgroundColor: 'rgba(255, 255, 255, 0.2)',
              color: 'white',
              fontWeight: 500,
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Box sx={{ display: 'flex', gap: 1 }}>
          <Button
            color="inherit"
            onClick={() => navigate('/locations')}
            startIcon={<LocationOn />}
            sx={{
              fontWeight: 500,
              px: 2,
              borderRadius: 2,
              backgroundColor:
                isActive('/locations') || isActive('/')
                  ? 'rgba(255, 255, 255, 0.15)'
                  : 'transparent',
              '&:hover': {
                backgroundColor: 'rgba(255, 255, 255, 0.1)',
              },
            }}
          >
            Gestionar Sedes
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
