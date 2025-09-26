import { useMemo } from 'react'
import './App.css'
import { AppProvider, useApp } from './context/AppContext'
import Controls from './components/Controls'
import ForecastCharts from './components/ForecastCharts'
import PremiumCard from './components/PremiumCard'
import LossChart from './components/LossChart'
import ExplainPanel from './components/ExplainPanel'
import TelemetryUpload from './components/TelemetryUpload'
import { AlertsPanel, AlertsToasts, simulateSubscription } from './components/Alerts'
import { Box, Container, CssBaseline, Grid, ThemeProvider, Typography, createTheme } from '@mui/material'

function Shell() {
  const { darkMode, loading, error } = useApp()
  const theme = useMemo(() => createTheme({ palette: { mode: darkMode ? 'dark' : 'light' } }), [darkMode])

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AlertsToasts />
      <Box sx={{ py: 3 }}>
        <Container maxWidth="xl">
          <Typography variant="h5" fontWeight={700} gutterBottom>
            Cosmic Weather Insurance System
          </Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            Autonomous space weather risk forecasting and transparent insurance pricing
          </Typography>

          <Controls />

          {error && (
            <Box sx={{ p: 2, border: '1px solid', borderColor: 'error.main', borderRadius: 2, mb: 2 }}>
              <Typography color="error">{String(error)}</Typography>
            </Box>
          )}

          <Grid container spacing={2}>
            <Grid item xs={12} md={8}>
              <ForecastCharts />
            </Grid>
            <Grid item xs={12} md={4}>
              <PremiumCard />
            </Grid>
            <Grid item xs={12} md={6}>
              <LossChart />
            </Grid>
            <Grid item xs={12} md={6}>
              <ExplainPanel />
            </Grid>
            <Grid item xs={12} md={6}>
              <TelemetryUpload />
            </Grid>
            <Grid item xs={12} md={6}>
              <AlertsPanel />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </ThemeProvider>
  )
}

export default function App() {
  return (
    <AppProvider>
      <Shell />
    </AppProvider>
  )
}
