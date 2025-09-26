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

// Enhanced Space Theme - Refined Dark Palette
function getTheme(darkMode) {
  return createTheme({
    palette: {
      mode: 'dark',
      primary: {
        main: '#4f46e5',    // Rich Indigo
        light: '#6366f1',
        dark: '#3730a3',
      },
      secondary: {
        main: '#7c3aed',    // Deep Purple
        light: '#8b5cf6',
        dark: '#5b21b6',
      },
      background: {
        default: '#050507',  // True Deep Black
        paper: '#0f0f14',    // Charcoal Black
      },
      surface: {
        main: '#1a1a22',    // Dark Grey Blue
        light: '#2a2a35',
        dark: '#0a0a0f',
      },
      text: {
        primary: '#f1f5f9',  // Soft White
        secondary: '#94a3b8', // Cool Grey
      },
      accent: {
        cyan: '#06b6d4',     // Bright Cyan
        emerald: '#10b981',  // Emerald
        amber: '#f59e0b',    // Warm Amber
        rose: '#f43f5e',     // Coral Rose
      }
    },
    typography: {
      fontFamily: '"Space Grotesk", "Inter", system-ui, -apple-system, sans-serif',
      h1: {
        fontFamily: '"Space Grotesk", sans-serif',
        fontWeight: 700,
        letterSpacing: '-0.025em',
      },
      h2: {
        fontFamily: '"Space Grotesk", sans-serif',
        fontWeight: 600,
        letterSpacing: '-0.02em',
      },
      h3: {
        fontFamily: '"Space Grotesk", sans-serif',
        fontWeight: 600,
        letterSpacing: '-0.015em',
      },
      h4: {
        fontFamily: '"Space Grotesk", sans-serif',
        fontWeight: 600,
        letterSpacing: '-0.01em',
        background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)',
        backgroundClip: 'text',
        WebkitBackgroundClip: 'text',
        WebkitTextFillColor: 'transparent',
      },
      h5: {
        fontFamily: '"Space Grotesk", sans-serif',
        fontWeight: 600,
        letterSpacing: '-0.005em',
      },
      h6: {
        fontFamily: '"Space Grotesk", sans-serif',
        fontWeight: 600,
        letterSpacing: '0em',
      },
      body1: {
        fontFamily: '"Inter", sans-serif',
        fontWeight: 400,
        lineHeight: 1.6,
      },
      body2: {
        fontFamily: '"Inter", sans-serif',
        fontWeight: 400,
        lineHeight: 1.5,
      },
      button: {
        fontFamily: '"Space Grotesk", sans-serif',
        fontWeight: 500,
        letterSpacing: '0.025em',
        textTransform: 'none',
      },
    },
    shape: {
      borderRadius: 12,
    },
    components: {
      MuiAppBar: {
        styleOverrides: {
          root: {
            background: 'linear-gradient(135deg, #050507 0%, #0f0f14 50%, #1a1a22 100%)',
            backdropFilter: 'blur(24px)',
            borderBottom: `1px solid ${alpha('#4f46e5', 0.2)}`,
            boxShadow: '0 8px 32px rgba(15, 15, 20, 0.8)',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            background: 'linear-gradient(135deg, #0f0f14 0%, #1a1a22 100%)',
            border: `1px solid ${alpha('#4f46e5', 0.15)}`,
            boxShadow: '0 4px 24px rgba(0, 0, 0, 0.4), 0 0 0 1px rgba(79, 70, 229, 0.05)',
            transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-4px)',
              boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6), 0 0 0 1px rgba(79, 70, 229, 0.2)',
              border: `1px solid ${alpha('#4f46e5', 0.3)}`,
            },
          },
        },
      },
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: 8,
            fontWeight: 500,
            transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
            '&:hover': {
              transform: 'translateY(-1px)',
            }
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            fontFamily: '"Space Grotesk", sans-serif',
            fontWeight: 500,
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
      color: '#4f46e5',
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
      color: '#7c3aed',
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
      color: '#f43f5e',
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
      
      {/* Google Fonts */}
      <style jsx>{`
        @import url('https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Inter:wght@300;400;500;600;700&display=swap');
      `}</style>
      
      {/* Navigation Bar */}
      <AppBar position="static" elevation={0}>
        <Toolbar sx={{ py: 1 }}>
          {/* Logo */}
          <Stack direction="row" alignItems="center" spacing={2} sx={{ flexGrow: 1 }}>
            <Box
              sx={{
                position: 'relative',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                width: 48,
                height: 48,
                borderRadius: '50%',
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)',
                '&::before': {
                  content: '""',
                  position: 'absolute',
                  inset: 2,
                  borderRadius: '50%',
                  background: '#0f0f14',
                  zIndex: 0,
                },
                '&::after': {
                  content: '""',
                  position: 'absolute',
                  inset: -2,
                  borderRadius: '50%',
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed, #06b6d4)',
                  opacity: 0.3,
                  filter: 'blur(8px)',
                  animation: 'glow 3s ease-in-out infinite alternate'
                }
              }}
            >
              <Rocket 
                sx={{ 
                  fontSize: 28, 
                  color: '#06b6d4',
                  position: 'relative',
                  zIndex: 1,
                  filter: 'drop-shadow(0 0 8px rgba(6, 182, 212, 0.4))'
                }} 
              />
            </Box>
            <Typography 
              variant="h5" 
              component="div" 
              sx={{ 
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '0.02em'
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
                startIcon={<item.icon sx={{ color: item.color, fontSize: '1.2rem' }} />}
                onClick={() => handleFeatureClick(item.id)}
                sx={{
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 500,
                  borderRadius: 2,
                  px: 3,
                  py: 1,
                  color: '#f1f5f9',
                  background: activeFeature === item.id 
                    ? `linear-gradient(135deg, ${alpha(item.color, 0.15)} 0%, ${alpha(item.color, 0.08)} 100%)` 
                    : 'transparent',
                  border: activeFeature === item.id 
                    ? `1px solid ${alpha(item.color, 0.3)}` 
                    : '1px solid transparent',
                  backdropFilter: activeFeature === item.id ? 'blur(12px)' : 'none',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${alpha(item.color, 0.12)} 0%, ${alpha(item.color, 0.06)} 100%)`,
                    transform: 'translateY(-1px)',
                    boxShadow: `0 8px 25px ${alpha(item.color, 0.25)}`,
                    border: `1px solid ${alpha(item.color, 0.4)}`
                  }
                }}
              >
                {item.label}
              </Button>
            ))}
          </Stack>

          {/* Actions */}
          <Stack direction="row" spacing={2} alignItems="center" sx={{ ml: 3 }}>
            {/* Notifications */}
            <IconButton 
              color="inherit"
              onClick={handleNotificationsOpen}
              sx={{
                width: 48,
                height: 48,
                background: 'linear-gradient(135deg, #1a1a22 0%, #2a2a35 100%)',
                border: `1px solid ${alpha('#4f46e5', 0.2)}`,
                borderRadius: 2,
                transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
                '&:hover': {
                  background: 'linear-gradient(135deg, #2a2a35 0%, #3a3a45 100%)',
                  transform: 'translateY(-2px)',
                  boxShadow: '0 8px 25px rgba(79, 70, 229, 0.3)',
                  border: `1px solid ${alpha('#4f46e5', 0.4)}`
                }
              }}
            >
              <Badge 
                badgeContent={alerts?.length || 0} 
                color="error"
                sx={{
                  '& .MuiBadge-badge': {
                    background: 'linear-gradient(135deg, #f43f5e 0%, #7c3aed 100%)',
                    boxShadow: '0 0 12px rgba(244, 63, 94, 0.5)',
                    fontFamily: '"Space Grotesk", sans-serif',
                    fontWeight: 600
                  }
                }}
              >
                <Notifications sx={{ color: '#f1f5f9' }} />
              </Badge>
            </IconButton>

            {/* Mobile Menu Button */}
            <IconButton
              color="inherit"
              onClick={() => setMobileMenuOpen(true)}
              sx={{ 
                display: { xs: 'flex', md: 'none' },
                width: 48,
                height: 48,
                background: 'linear-gradient(135deg, #1a1a22 0%, #2a2a35 100%)',
                border: `1px solid ${alpha('#4f46e5', 0.2)}`,
                borderRadius: 2,
                '&:hover': {
                  background: 'linear-gradient(135deg, #2a2a35 0%, #3a3a45 100%)',
                }
              }}
            >
              <MenuIcon sx={{ color: '#f1f5f9' }} />
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
            background: 'linear-gradient(135deg, #0f0f14 0%, #1a1a22 100%)',
            backdropFilter: 'blur(24px)',
            border: `1px solid ${alpha('#4f46e5', 0.2)}`,
            borderRadius: 3,
            minWidth: 340,
            mt: 1,
            boxShadow: '0 12px 40px rgba(0, 0, 0, 0.6)',
            '&::before': {
              content: '""',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              height: 3,
              background: 'linear-gradient(90deg, #4f46e5, #7c3aed, #06b6d4)',
              borderRadius: '12px 12px 0 0'
            }
          }
        }}
      >
        <MenuItem disabled sx={{ py: 2 }}>
          <ListItemText 
            primary={
              <Typography variant="h6" sx={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: 1,
                fontFamily: '"Space Grotesk", sans-serif',
                color: '#f1f5f9'
              }}>
                <Warning sx={{ color: '#f59e0b' }} /> Cosmic Alerts
              </Typography>
            }
            secondary={
              <Typography variant="body2" sx={{ color: '#94a3b8', mt: 0.5 }}>
                {alerts?.length || 0} active notifications
              </Typography>
            }
          />
        </MenuItem>
        <Divider sx={{ borderColor: alpha('#4f46e5', 0.15) }} />
        
        {recentAlerts.length > 0 ? (
          recentAlerts.map((alert, index) => (
            <MenuItem 
              key={index} 
              onClick={handleNotificationsClose}
              sx={{
                py: 1.5,
                '&:hover': {
                  background: alpha('#4f46e5', 0.08)
                }
              }}
            >
              <ListItemIcon>
                <Warning sx={{ color: '#f59e0b' }} />
              </ListItemIcon>
              <ListItemText 
                primary={
                  <Typography sx={{ color: '#f1f5f9', fontWeight: 500 }}>
                    {alert.message || 'Space weather alert'}
                  </Typography>
                }
                secondary={
                  <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                    {alert.at}
                  </Typography>
                }
              />
            </MenuItem>
          ))
        ) : (
          <MenuItem disabled sx={{ py: 2 }}>
            <ListItemText 
              primary={
                <Typography sx={{ color: '#10b981', fontWeight: 500 }}>
                  No active alerts
                </Typography>
              }
              secondary={
                <Typography variant="body2" sx={{ color: '#94a3b8' }}>
                  All systems nominal
                </Typography>
              }
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
            background: 'linear-gradient(135deg, #050507 0%, #0f0f14 50%, #1a1a22 100%)',
            width: 300,
            borderLeft: `1px solid ${alpha('#4f46e5', 0.2)}`
          }
        }}
      >
        <Box sx={{ p: 3 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={4}>
            <Typography variant="h6" sx={{ 
              color: '#f1f5f9',
              fontFamily: '"Space Grotesk", sans-serif',
              fontWeight: 600
            }}>
              Mission Menu
            </Typography>
            <IconButton 
              onClick={() => setMobileMenuOpen(false)} 
              sx={{ 
                color: '#f1f5f9',
                background: alpha('#4f46e5', 0.1),
                '&:hover': {
                  background: alpha('#4f46e5', 0.2)
                }
              }}
            >
              <Close />
            </IconButton>
          </Stack>

          <Stack spacing={2}>
            {navigationItems.map((item) => (
              <Button
                key={item.id}
                fullWidth
                color="inherit"
                startIcon={<item.icon sx={{ color: item.color, fontSize: '1.3rem' }} />}
                onClick={() => handleFeatureClick(item.id)}
                sx={{
                  justifyContent: 'flex-start',
                  borderRadius: 2,
                  py: 2,
                  px: 3,
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 500,
                  color: '#f1f5f9',
                  background: activeFeature === item.id 
                    ? `linear-gradient(135deg, ${alpha(item.color, 0.2)} 0%, ${alpha(item.color, 0.1)} 100%)` 
                    : alpha(item.color, 0.05),
                  border: activeFeature === item.id 
                    ? `1px solid ${alpha(item.color, 0.4)}` 
                    : '1px solid transparent',
                  '&:hover': {
                    background: `linear-gradient(135deg, ${alpha(item.color, 0.15)} 0%, ${alpha(item.color, 0.08)} 100%)`,
                    transform: 'translateX(8px)',
                    border: `1px solid ${alpha(item.color, 0.3)}`
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
          background: 'linear-gradient(135deg, #050507 0%, #0f0f14 30%, #1a1a22 70%, #2a2a35 100%)',
          minHeight: '35vh',
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
            background: `
              radial-gradient(circle at 25% 75%, ${alpha('#4f46e5', 0.1)} 0%, transparent 50%),
              radial-gradient(circle at 75% 25%, ${alpha('#7c3aed', 0.08)} 0%, transparent 50%),
              radial-gradient(circle at 50% 50%, ${alpha('#06b6d4', 0.06)} 0%, transparent 50%)
            `,
          },
          '&::after': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundImage: `
              radial-gradient(1px 1px at 20px 30px, ${alpha('#4f46e5', 0.3)}, transparent),
              radial-gradient(1px 1px at 40px 70px, ${alpha('#7c3aed', 0.2)}, transparent),
              radial-gradient(1px 1px at 80px 120px, ${alpha('#06b6d4', 0.3)}, transparent),
              radial-gradient(1px 1px at 120px 40px, ${alpha('#10b981', 0.2)}, transparent)
            `,
            backgroundSize: '160px 160px',
            opacity: 0.4,
          }
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 10, py: 6 }}>
          <Box sx={{ textAlign: 'center', mb: 4 }}>
            <Chip 
              icon={<Satellite sx={{ color: '#f1f5f9' }} />} 
              label="SPACE WEATHER INTELLIGENCE" 
              variant="filled"
              sx={{ 
                mb: 4,
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)',
                color: '#f1f5f9',
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 600,
                fontSize: '0.9rem',
                py: 1.5,
                px: 2,
                borderRadius: 2,
                boxShadow: '0 4px 20px rgba(79, 70, 229, 0.3)',
              }}
            />
            
            <Typography 
              variant="h2" 
              component="h1"
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '4.5rem', lg: '5.5rem' },
                lineHeight: 0.9,
                mb: 3,
                background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 30%, #06b6d4 70%, #10b981 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                letterSpacing: '-0.025em',
              }}
            >
              Cosmic Shield
            </Typography>
            
            <Typography 
              variant="h6" 
              sx={{ 
                color: '#94a3b8',
                maxWidth: '640px',
                mx: 'auto',
                fontWeight: 400,
                mb: 4,
                fontSize: '1.2rem',
                lineHeight: 1.5,
              }}
            >
              Advanced space weather risk forecasting and cosmic asset protection through AI-powered monitoring systems
            </Typography>

            <Stack 
              direction={{ xs: 'column', sm: 'row' }} 
              spacing={2} 
              justifyContent="center" 
              alignItems="center"
              sx={{ mb: 2 }}
            >
              <Chip 
                icon={<Star sx={{ color: '#f59e0b' }} />} 
                label="Real-time Monitoring" 
                variant="outlined"
                sx={{ 
                  color: '#f1f5f9', 
                  borderColor: alpha('#f59e0b', 0.3),
                  background: alpha('#f59e0b', 0.05),
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 500,
                }}
              />
              <Chip 
                icon={<Warning sx={{ color: '#10b981' }} />} 
                label="AI-Powered Alerts" 
                variant="outlined"
                sx={{ 
                  color: '#f1f5f9', 
                  borderColor: alpha('#10b981', 0.3),
                  background: alpha('#10b981', 0.05),
                  fontFamily: '"Space Grotesk", sans-serif',
                  fontWeight: 500,
                }}
              />
            </Stack>
          </Box>

          <Controls />
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        py: 8, 
        background: 'linear-gradient(135deg, #050507 0%, #0f0f14 100%)',
        minHeight: '65vh'
      }}>
        <Container maxWidth="xl">
          {error && (
            <Box 
              sx={{ 
                p: 4, 
                mb: 4,
                background: 'linear-gradient(135deg, #1a1a22 0%, #2a2a35 100%)',
                border: `1px solid ${alpha('#f43f5e', 0.3)}`,
                borderRadius: 3,
                display: 'flex',
                alignItems: 'center',
                gap: 2,
              }}
            >
              <Warning sx={{ color: '#f43f5e', fontSize: '1.5rem' }} />
              <Typography sx={{ 
                color: '#f43f5e', 
                fontWeight: 500,
                fontFamily: '"Space Grotesk", sans-serif'
              }}>
                {String(error)}
              </Typography>
            </Box>
          )}

          {loading && (
            <LinearProgress 
              sx={{ 
                mb: 4,
                height: 8,
                borderRadius: 4,
                background: alpha('#4f46e5', 0.1),
                '& .MuiLinearProgress-bar': {
                  background: 'linear-gradient(90deg, #4f46e5 0%, #7c3aed 50%, #06b6d4 100%)',
                  borderRadius: 4,
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
        @keyframes glow {
          0% { 
            opacity: 0.3;
            transform: scale(1);
          }
          50% { 
            opacity: 0.6;
            transform: scale(1.05);
          }
          100% { 
            opacity: 0.3;
            transform: scale(1);
          }
        }
        
        @keyframes pulse {
          0% { 
            transform: scale(1); 
            opacity: 1; 
          }
          50% { 
            transform: scale(1.02); 
            opacity: 0.9; 
          }
          100% { 
            transform: scale(1); 
            opacity: 1; 
          }
        }

        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }

        /* Custom scrollbar */
        ::-webkit-scrollbar {
          width: 8px;
        }

        ::-webkit-scrollbar-track {
          background: #0f0f14;
        }

        ::-webkit-scrollbar-thumb {
          background: linear-gradient(135deg, #4f46e5, #7c3aed);
          border-radius: 4px;
        }

        ::-webkit-scrollbar-thumb:hover {
          background: linear-gradient(135deg, #6366f1, #8b5cf6);
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