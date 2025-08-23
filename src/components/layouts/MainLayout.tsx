import { ArrowBack, Cancel, Home } from '@mui/icons-material';
import { AppBar, Box, IconButton, Toolbar, Typography } from '@mui/material';
import React from 'react';
import { Outlet, useNavigate } from 'react-router-dom';

interface MainLayoutProps {
  title?: string;
  showBackButton?: boolean;
  showHomeButton?: boolean;
  showCancelButton?: boolean;
  onBack?: () => void;
  onHome?: () => void;
  onCancel?: () => void;
}

const MainLayout: React.FC<MainLayoutProps> = ({
  title = '교회 출석 관리',
  showBackButton = false,
  showHomeButton = false,
  showCancelButton = false,
  onBack,
  onHome,
  onCancel,
}) => {
  const navigate = useNavigate();

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate(-1);
    }
  };

  const handleHome = () => {
    if (onHome) {
      onHome();
    } else {
      navigate('/main/service-selection');
    }
  };

  const handleCancel = () => {
    if (onCancel) {
      onCancel();
    } else {
      navigate('/main/service-selection');
    }
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position='static' sx={{ backgroundColor: '#4ecdc4' }}>
        <Toolbar>
          {showBackButton && (
            <IconButton
              edge='start'
              color='inherit'
              onClick={handleBack}
              sx={{ mr: 1 }}
            >
              <ArrowBack />
            </IconButton>
          )}

          <Typography variant='h6' component='div' sx={{ flexGrow: 1 }}>
            {title}
          </Typography>

          {showHomeButton && (
            <IconButton color='inherit' onClick={handleHome} sx={{ mr: 1 }}>
              <Home />
            </IconButton>
          )}

          {showCancelButton && (
            <IconButton color='inherit' onClick={handleCancel}>
              <Cancel />
            </IconButton>
          )}
        </Toolbar>
      </AppBar>

      <Box component='main' sx={{ flexGrow: 1, p: 2 }}>
        <Outlet />
      </Box>
    </Box>
  );
};

export default MainLayout;
