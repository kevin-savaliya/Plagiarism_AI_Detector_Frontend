import React from 'react';
import { AppBar, Toolbar, Typography, Button, Container, Box } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CompareIcon from '@mui/icons-material/Compare';
import SmartToyIcon from '@mui/icons-material/SmartToy';

const Layout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static">
        <Toolbar>
          <AssessmentIcon sx={{ mr: 2 }} />
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Plagiarism & AI Detection System
          </Typography>
          <Button
            color="inherit"
            component={RouterLink}
            to="/"
            startIcon={<AssessmentIcon />}
          >
            Home
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/similarity"
            startIcon={<CompareIcon />}
          >
            Similarity Analysis
          </Button>
          <Button
            color="inherit"
            component={RouterLink}
            to="/ai-detection"
            startIcon={<SmartToyIcon />}
          >
            AI Detection
          </Button>
        </Toolbar>
      </AppBar>
      <Container component="main" sx={{ mt: 4, mb: 4, flex: 1 }}>
        {children}
      </Container>
      <Box
        component="footer"
        sx={{
          py: 3,
          px: 2,
          mt: 'auto',
          backgroundColor: (theme) =>
            theme.palette.mode === 'light'
              ? theme.palette.grey[200]
              : theme.palette.grey[800],
        }}
      >
        <Container maxWidth="sm">
          <Typography variant="body2" color="text.secondary" align="center">
            © {new Date().getFullYear()} Plagiarism & AI Detection System
          </Typography>
        </Container>
      </Box>
    </Box>
  );
};

export default Layout; 