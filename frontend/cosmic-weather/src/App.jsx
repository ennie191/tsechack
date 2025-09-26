import React from 'react'
import { useState, useMemo } from 'react'
import './App.css'
import { AppProvider, useApp } from './context/AppContext'
import Controls from './components/Controls'
import ForecastCharts from './components/ForecastCharts'
import PremiumCard from './components/PremiumCard'
import LossChart from './components/LossChart'
import ExplainPanel from './components/ExplainPanel'
import TelemetryUpload from './components/TelemetryUpload'
import { AlertsPanel, AlertsToasts } from './components/Alerts'
import { 
  Box, 
  Container, 
  CssBaseline, 
  Grid, 
  ThemeProvider, 
  Typography, 
  createTheme,
  alpha,
  LinearProgress,
  Chip,
  Stack,
  AppBar,
  Toolbar,
  Button,
  IconButton,
  Badge,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Divider,
  Switch,
  Drawer
} from '@mui/material'
import { 
  Rocket,
  Satellite,
  Star,
  Warning,
  Notifications,
  DarkMode,
  LightMode,
  Dashboard,
  Analytics,
  Public,
  Science,
  Security,
  Cloud,
  Menu as MenuIcon,
  Close
} from '@mui/icons-material'

// Space Theme - Black, Dark Blue, Grey Palette
function getTheme(darkMode) {
  return createTheme({
    palette: {
      mode: 'dark', // Force dark mode for space theme
      primary: {
        main: '#3b82f6',    // Cosmic Blue
        light: '#60a5fa',
        dark: '#2563eb',
      },
      secondary: {
        main: '#8b5cf6',    // Nebula Purple
        light: '#a78bfa',
        dark: '#7c3aed',
      },
      background: {
        default: '#0a0a0f',  // Deep Space Black
        paper: '#1a1a2e',    // Space Navy
      },
      text: {
        primary: '#e2e8f0',  // Cosmic White
        secondary: '#94a3b8', // Space Grey
      }
    },
    typography: {
      fontFamily: '"Orbitron", "Inter", "system-ui", "sans-serif"',
      h4: {
        fontWeight: 800,
        letterSpacing: '0.1em',
        background: 'linear-gradient(45deg, #3b82f6 30%, #8b5cf6 90%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      },
      h6: {
        fontWeight: 600,
        letterSpacing: '0.05em',
      },
    },
    shape: {
      borderRadius: 8,
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
            backdropFilter: 'blur(20px)',
            borderBottom: `1px solid ${alpha('#3b82f6', 0.3)}`,
            boxShadow: '0 4px 20px rgba(59, 130, 246, 0.1)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            border: `1px solid ${alpha('#3b82f6', 0.2)}`,
            boxShadow: '0 8px 32px rgba(59, 130, 246, 0.1)',
            transition: 'all 0.3s ease-in-out',
            '&:hover': {
              transform: 'translateY(-2px)',
              boxShadow: '0 12px 40px rgba(59, 130, 246, 0.2)',
              border: `1px solid ${alpha('#3b82f6', 0.4)}`,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            textTransform: 'none',
            fontWeight: 600,
            transition: 'all 0.3s ease',
          },
        },
      },
    },
  })
}

function Shell() {
  const { darkMode, setDarkMode, alerts, loading, error } = useApp()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [notificationsAnchor, setNotificationsAnchor] = useState(null)
  const [activeFeature, setActiveFeature] = useState('dashboard')
  const theme = useMemo(() => getTheme(darkMode), [darkMode])

  const handleNotificationsOpen = (event) => {
    setNotificationsAnchor(event.currentTarget)
  }

  const handleNotificationsClose = () => {
    setNotificationsAnchor(null)
  }

  const handleFeatureClick = (feature) => {
    setActiveFeature(feature)
    setMobileMenuOpen(false)
  }

  const navigationItems = [
    { 
      id: 'dashboard', 
      icon: Dashboard, 
      label: 'Mission Control', 
      color: '#3b82f6',
      component: <Grid container spacing={3}>
        <Grid item xs={12} lg={8}>
          <ForecastCharts />
        </Grid>
        <Grid item xs={12} lg={4}>
          <Stack spacing={3}>
            <PremiumCard />
            <TelemetryUpload />
          </Stack>
        </Grid>
      </Grid>
    },
    { 
      id: 'analytics', 
      icon: Analytics, 
      label: 'Cosmic Analytics', 
      color: '#8b5cf6',
      component: <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <ForecastCharts />
        </Grid>
        <Grid item xs={12} lg={6}>
          <ExplainPanel />
        </Grid>
      </Grid>
    },
    { 
      id: 'maps', 
      icon: Public, 
      label: 'Orbit Maps', 
      color: '#10b981',
      component: <Grid container spacing={3}>
        <Grid item xs={12}>
          <Typography variant="h4" gutterBottom>
            Orbit Visualization
          </Typography>
          <Typography color="text.secondary">
            Real-time satellite orbit tracking and space weather mapping
          </Typography>
        </Grid>
      </Grid>
    },
    { 
      id: 'research', 
      icon: Science, 
      label: 'Research Lab', 
      color: '#f59e0b',
      component: <Grid container spacing={3}>
        <Grid item xs={12} lg={6}>
          <ExplainPanel />
        </Grid>
        <Grid item xs={12} lg={6}>
          <LossChart />
        </Grid>
      </Grid>
    },
    { 
      id: 'security', 
      icon: Security, 
      label: 'Shield Status', 
      color: '#ef4444',
      component: <Grid container spacing={3}>
        <Grid item xs={12}>
          <AlertsPanel />
        </Grid>
        <Grid item xs={12} lg={6}>
          <PremiumCard />
        </Grid>
      </Grid>
    },
    { 
      id: 'weather', 
      icon: Cloud, 
      label: 'Weather Data', 
      color: '#06b6d4',
      component: <Grid container spacing={3}>
        <Grid item xs={12}>
          <ForecastCharts />
        </Grid>
        <Grid item xs={12} lg={6}>
          <TelemetryUpload />
        </Grid>
      </Grid>
    }
  ]

  const recentAlerts = alerts?.slice(0, 5) || []
  const activeComponent = navigationItems.find(item => item.id === activeFeature)?.component

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AlertsToasts />
      
      {/* Navigation Bar */}
      <AppBar position="static" elevation={0}>
        <Toolbar>
          {/* Logo */}
          <Stack direction="row" alignItems="center" spacing={1} sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                position: 'relative',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  top: -2,
                  left: -2,
                  right: -2,
                  bottom: -2,
                  background: 'linear-gradient(45deg, #3b82f6, #8b5cf6, #06b6d4)',
                  borderRadius: '50%',
                  zIndex: 0,
                  animation: 'pulse 3s infinite'
                }
              }}
            >
              <Rocket 
                sx={{ 
                  fontSize: 32, 
                  color: '#06b6d4',
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.5))'
                }} 
              />
            </Box>
            <Typography 
              variant="h6" 
              component="div" 
              sx={{ 
                fontWeight: 800,
                background: 'linear-gradient(45deg, #3b82f6 30%, #8b5cf6 70%, #06b6d4 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                textShadow: '0 0 20px rgba(59, 130, 246, 0.3)',
                letterSpacing: '0.1em'
              }}
            >
              COSMIC SHIELD
            </Typography>
          </Stack>

          {/* Desktop Navigation */}
          <Stack direction="row" spacing={1} sx={{ display: { xs: 'none', md: 'flex' } }}>
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                color="inherit"
                startIcon={<item.icon sx={{ color: item.color }} />}
                onClick={() => handleFeatureClick(item.id)}
                sx={{
                  fontWeight: 600,
                  borderRadius: 2,
                  px: 2,
                  background: activeFeature === item.id ? alpha(item.color, 0.2) : 'transparent',
                  border: activeFeature === item.id ? `1px solid ${alpha(item.color, 0.4)}` : '1px solid transparent',
                  '&:hover': {
                    background: alpha(item.color, 0.1),
                    transform: 'translateY(-1px)',
                    boxShadow: `0 4px 15px ${alpha(item.color, 0.3)}`
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          {/* Actions */}
          <Stack direction="row" spacing={1} alignItems="center" sx={{ ml: 2 }}>
            {/* Notifications */}
            <IconButton 
              color="inherit"
              onClick={handleNotificationsOpen}
              sx={{
                border: `1px solid ${alpha('#3b82f6', 0.3)}`,
                borderRadius: 2,
                transition: 'all 0.3s ease',
                '&:hover': {
                  background: alpha('#8b5cf6', 0.1),
                  transform: 'scale(1.1)',
                  boxShadow: '0 0 15px rgba(139, 92, 246, 0.3)'
                }
              }}
            >
              <Badge 
                badgeContent={alerts?.length || 0} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    background: 'linear-gradient(45deg, #ef4444, #8b5cf6)',
                    boxShadow: '0 0 8px rgba(239, 68, 68, 0.5)'
                  }
                }}
              >
                <Notifications />
              </Badge>
            </IconButton>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ 
                display: { xs: 'flex', md: 'none' },
                border: `1px solid ${alpha('#3b82f6', 0.3)}`,
              }}
            >
              <MenuIcon />
            </IconButton>
          </Stack>
        </Toolbar>
      </AppBar>

      {/* Notifications Menu */}
      <Menu
        anchorEl={notificationsAnchor}
        open={Boolean(notificationsAnchor)}
        onClose={handleNotificationsClose}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            backdropFilter: 'blur(20px)',
            border: `1px solid ${alpha('#3b82f6', 0.3)}`,
            minWidth: 320,
            mt: 1,
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background: 'linear-gradient(90deg, #3b82f6, #8b5cf6)'
            }
          }
        }}
      >
        <MenuItem disabled>
          <ListItemText 
            primary={
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Warning sx={{ color: '#f59e0b' }} /> Cosmic Alerts
              </Typography>
            }
            secondary={`${alerts?.length || 0} active notifications`}
          />
        </MenuItem>
        <Divider />
        
        {recentAlerts.length > 0 ? (
          recentAlerts.map((alert, index) => (
            <MenuItem key={index} onClick={handleNotificationsClose}>
              <ListItemIcon>
                <Warning sx={{ color: '#f59e0b' }} />
              </ListItemIcon>
              <ListItemText 
                primary={alert.message || 'Space weather alert'}
                secondary={alert.at}
                sx={{ color: '#e2e8f0' }}
              />
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled>
            <ListItemText 
              primary="No active alerts"
              secondary="All systems nominal"
              sx={{ color: '#94a3b8' }}
            />
          </MenuItem>
        )}
      </Menu>

      {/* Mobile Menu Drawer */}
      <Drawer
        anchor="right"
        open={mobileMenuOpen}
        onClose={() => setMobileMenuOpen(false)}
        PaperProps={{
          sx: {
            background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
            width: 280,
            borderLeft: `1px solid ${alpha('#3b82f6', 0.3)}`
          }
        }}
      >
        <Box sx={{ p: 2 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={3}>
            <Typography variant="h6" color="#e2e8f0">
              Mission Menu
            </Typography>
            <IconButton onClick={() => setMobileMenuOpen(false)} sx={{ color: '#e2e8f0' }}>
              <Close />
            </IconButton>
          </Stack>

          <Stack spacing={1}>
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                fullWidth
                color="inherit"
                startIcon={<item.icon sx={{ color: item.color }} />}
                onClick={() => handleFeatureClick(item.id)}
                sx={{
                  justifyContent: 'flex-start',
                  borderRadius: 2,
                  py: 1.5,
                  color: '#e2e8f0',
                  background: activeFeature === item.id ? alpha(item.color, 0.2) : alpha(item.color, 0.1),
                  border: activeFeature === item.id ? `1px solid ${alpha(item.color, 0.4)}` : '1px solid transparent',
                  '&:hover': {
                    background: alpha(item.color, 0.2),
                    transform: 'translateX(4px)'
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>
        </Box>
      </Drawer>

      {/* Hero Section */}
      <Box 
        sx={{ 
          position: 'relative',
          background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 50%, #16213e 100%)',
          minHeight: '30vh',
          display: 'flex',
          alignItems: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'radial-gradient(circle at 20% 80%, rgba(59, 130, 246, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(139, 92, 246, 0.05) 0%, transparent 50%)',
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: 'url("data:image/svg+xml,%3Csvg width=\"100\" height=\"100\" viewBox=\"0 0 100 100\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Ccircle cx=\"20\" cy=\"20\" r=\"0.5\" fill=\"%233b82f6\" opacity=\"0.3\"/%3E%3Ccircle cx=\"80\" cy=\"40\" r=\"0.3\" fill=\"%238b5cf6\" opacity=\"0.3\"/%3E%3Ccircle cx=\"40\" cy=\"80\" r=\"0.4\" fill=\"%2306b6d4\" opacity=\"0.3\"/%3E%3Ccircle cx=\"60\" cy=\"60\" r=\"0.2\" fill=\"%2310b981\" opacity=\"0.3\"/%3E%3C/svg%3E")',
            opacity: 0.6,
          }
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 10, py: 4 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Chip 
              icon={<Satellite />} 
              label="SPACE WEATHER INTELLIGENCE" 
              variant="filled"
              sx={{ 
                mb: 3,
                background: 'linear-gradient(45deg, #3b82f6 30%, #8b5cf6 90%)',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.9rem',
                py: 1,
              }}
            />
            
            <Typography 
              variant="h3" 
              component="h1"
              sx={{
                fontWeight: 800,
                fontSize: { xs: '2.5rem', md: '4rem' },
                lineHeight: 1.1,
                mb: 2,
                background: 'linear-gradient(45deg, #3b82f6 20%, #8b5cf6 50%, #06b6d4 80%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              Cosmic Shield
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#94a3b8',
                maxWidth: '600px',
                mx: 'auto',
                fontWeight: 400,
                mb: 3,
              }}
            >
              Advanced space weather risk forecasting and cosmic asset protection
            </Typography>

            <Stack direction="row" spacing={2} justifyContent="center" alignItems="center" flexWrap="wrap">
              <Chip 
                icon={<Star sx={{ color: '#f59e0b' }} />} 
                label="Real-time Monitoring" 
                variant="outlined"
                sx={{ color: '#e2e8f0', borderColor: '#334155', mb: 1 }}
              />
              <Chip 
                icon={<Warning sx={{ color: '#10b981' }} />} 
                label="AI-Powered Alerts" 
                variant="outlined"
                sx={{ color: '#e2e8f0', borderColor: '#334155', mb: 1 }}
              />
            </Stack>
          </Box>

          <Controls />
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        py: 6, 
        background: 'linear-gradient(135deg, #0a0a0f 0%, #1a1a2e 100%)',
        minHeight: '70vh'
      }}>
        <Container maxWidth="xl">
          {error && (
            <Box 
              sx={{ 
                p: 3, 
                mb: 4,
                background: 'linear-gradient(45deg, #1a1a2e 0%, #16213e 100%)',
                border: '1px solid #ef4444',
                borderRadius: 2,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Warning sx={{ color: '#ef4444' }} />
              <Typography color="#ef4444" sx={{ fontWeight: 500 }}>
                {String(error)}
              </Typography>
            </Box>
          )}

          {loading && (
            <LinearProgress 
              sx={{ 
                mb: 4,
                height: 6,
                borderRadius: 3,
                background: alpha('#3b82f6', 0.1),
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(45deg, #3b82f6 30%, #8b5cf6 90%)',
                }
              }} 
            />
          )}

          {/* Dynamic Content based on selected feature */}
          {activeComponent}
        </Container>
      </Box>

      {/* Global Styles for Animations */}
      <style jsx>{`
        @keyframes pulse {
          0% { transform: scale(1); opacity: 1; }
          50% { transform: scale(1.05); opacity: 0.8; }
          100% { transform: scale(1); opacity: 1; }
        }
      `}</style>
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