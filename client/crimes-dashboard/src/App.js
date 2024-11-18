import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import CrimeMap from './components/CrimeMap';
import StateCrimeDetails from './components/StateCrimeDetails';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    error: {
      main: '#d32f2f',
    }
  },
});

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Routes>
          <Route path="/" element={<CrimeMap />} />
          <Route path="/state/:state" element={<StateCrimeDetails />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
};

export default App;