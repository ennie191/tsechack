import React from 'react'
import { useState, useMemo } from 'react'
import './App.css'
import { AppProvider, useApp } from './context/AppContext'
import Controls from './components/Controls'
import ForecastCharts from './components/ForecastCharts'
import PremiumCard from './components/PremiumCard'
import LossChart from './components/LossChart'
import ExplainPanel from './components/ExplainPanel'
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
  Drawer
} from '@mui/material'
import { 
  Rocket,
  Satellite,
  Star,
  Warning,
  Notifications,
  Dashboard,
  Analytics,
  MonetizationOn,
  Public,
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
  const { darkMode, alerts, loading, error } = useApp()
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
    // Scroll to correct section
    const element = document.getElementById(feature)
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' })
    }
  }

  const navigationItems = [
    { 
      id: 'dashboard', 
      icon: Dashboard, 
      label: 'Dashboard', 
      color: '#06b6d4',
    },
    { 
      id: 'dataForecasting', 
      icon: Analytics, 
      label: 'Data & Forecasting', 
      color: '#4f46e5',
    },
    { 
      id: 'riskModeling', 
      icon: MonetizationOn, 
      label: 'Risk & Impact Modeling', 
      color: '#7c3aed',
    },
    { 
      id: 'insurancePricing', 
      icon: Public, 
      label: 'Insurance Pricing', 
      color: '#10b981',
    }
  ]

  const recentAlerts = alerts?.slice(0, 5) || []

  // Components to render for each section, can expand as needed
  const sectionComponents = {
    dashboard: (
      <Box id="dashboard">
        <Grid container spacing={3}>
          {/* Forecast Charts - Left Side */}
          <Grid item xs={12} lg={8}>
            <ForecastCharts />
          </Grid>

          {/* Premium Card - Right Side */}
          <Grid item xs={12} lg={4}>
            <Stack spacing={3}>
              <PremiumCard />
            </Stack>
          </Grid>

          {/* Loss Chart & Explain Panel - Bottom */}
          <Grid item xs={12} md={6}>
            <LossChart />
          </Grid>
          <Grid item xs={12} md={6}>
            <ExplainPanel />
          </Grid>

          {/* Alerts Panel - Full Width Bottom */}
          <Grid item xs={12}>
            <AlertsPanel />
          </Grid>
        </Grid>
      </Box>
    ),
    dataForecasting: (
      <Box id="dataForecasting" sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>
         Data & Forecasting
        </Typography>
        <Typography color="text.secondary">
          Build a model to forecast geomagnetic storm intensity and likelihood for the next 24–72 hours.
        </Typography>
        {/* You can add more components relevant to this section here */}
      </Box>
    ),
    riskModeling: (
      <Box id="riskModeling" sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>
          Risk & Impact Modeling
        </Typography>
        <Typography color="text.secondary">
          Map forecasted conditions to potential asset impact (e.g., satellite anomaly probability or expected downtime). Output a probabilistic loss distribution.
        </Typography>
        {/* Additional UI elements can go here */}
      </Box>
    ),
    insurancePricing: (
      <Box id="insurancePricing" sx={{ py: 6 }}>
        <Typography variant="h4" gutterBottom>
          Insurance Pricing
        </Typography>
        <Typography color="text.secondary">
          Translate expected loss into a suggested insurance premium, clearly stating assumptions. Display confidence intervals or uncertainty bounds.
        </Typography>
        {/* Additional pricing components can go here */}
      </Box>
    )
  }

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

      {/* Earth Image Hero Section */}
      <Box 
        sx={{ 
          position: 'relative',
          background: 'linear-gradient(135deg, #000000 0%, #0a0a0a 100%)',
          minHeight: '60vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            background: `
              radial-gradient(circle at 20% 50%, rgba(79, 70, 229, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 80% 20%, rgba(124, 58, 237, 0.05) 0%, transparent 50%),
              radial-gradient(circle at 40% 80%, rgba(6, 182, 212, 0.08) 0%, transparent 50%)
            `,
          }
        }}
      >
        <Container maxWidth="xl" sx={{ position: 'relative', zIndex: 10, textAlign: 'center' }}>
          {/* Earth Image Container */}
          <Box
            sx={{
              width: { xs: 200, md: 300, lg: 400 },
              height: { xs: 200, md: 300, lg: 400 },
              margin: '0 auto 3rem auto',
              backgroundImage: 'url("https://images.unsplash.com/photo-1446776877081-d282a0f896e2?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2072&q=80")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              borderRadius: '50%',
              boxShadow: `
                0 0 100px rgba(79, 70, 229, 0.3),
                0 0 200px rgba(124, 58, 237, 0.2),
                0 0 300px rgba(6, 182, 212, 0.1),
                inset 0 0 50px rgba(255, 255, 255, 0.1)
              `,
              border: '2px solid rgba(79, 70, 229, 0.3)',
              animation: 'float 6s ease-in-out infinite',
              position: 'relative',
              '&::after': {
                content: '""',
                position: 'absolute',
                top: -10,
                left: -10,
                right: -10,
                bottom: -10,
                borderRadius: '50%',
                border: '1px solid rgba(79, 70, 229, 0.2)',
                animation: 'pulse 3s ease-in-out infinite',
              }
            }}
          />

          {/* Hero Content */}
          <Box sx={{ mt: 4 }}>
            <Button 
  variant="contained" 
  color="primary" 
  sx={{ 
    mb: 3,
    fontFamily: '"Space Grotesk", sans-serif',
    fontWeight: 600,
    fontSize: { xs: '0.9rem', md: '1rem' },
    py: 1.5,
    px: 4,
    borderRadius: 2,
    textTransform: 'none',
    boxShadow: '0 4px 20px rgba(79, 70, 229, 0.4)',
  }}
  onClick={() => {
    const element = document.getElementById('dashboard');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  }}
>
  Get Started
</Button>

            
            <Typography 
              variant="h2" 
              component="h1"
              sx={{
                fontFamily: '"Space Grotesk", sans-serif',
                fontWeight: 700,
                fontSize: { xs: '2.5rem', md: '3.5rem', lg: '4.5rem' },
                lineHeight: 1.1,
                mb: 3,
                background: 'linear-gradient(135deg, #f1f5f9 0%, #94a3b8 100%)',
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
                mb: 4,
                fontSize: { xs: '1rem', md: '1.2rem' },
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
                  borderColor: 'rgba(245, 158, 11, 0.3)',
                  background: 'rgba(245, 158, 11, 0.05)',
                }}
              />
              <Chip 
                icon={<Warning sx={{ color: '#10b981' }} />} 
                label="AI-Powered Alerts" 
                variant="outlined"
                sx={{ 
                  color: '#f1f5f9', 
                  borderColor: 'rgba(16, 185, 129, 0.3)',
                  background: 'rgba(16, 185, 129, 0.05)',
                }}
              />
            </Stack>
          </Box>
        </Container>
      </Box>

      {/* Controls Section */}
      <Box sx={{ background: 'linear-gradient(135deg, #050507 0%, #0f0f14 100%)', py: 4 }}>
        <Container maxWidth="xl">
          <Controls />
        </Container>
      </Box>

      {/* Main Content */}
      <Box sx={{ 
        py: 8, 
        background: 'linear-gradient(135deg, #050507 0%, #0f0f14 100%)',
        minHeight: '70vh'
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

          {/* Dashboard Section Description */}
          {activeFeature === 'dashboard' && (
            <Box sx={{ mb: 6 }}>
              <Typography variant="h4" gutterBottom sx={{ 
                background: 'linear-gradient(135deg, #06b6d4 0%, #4f46e5 100%)',
                backgroundClip: 'text',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                mb: 3
              }}>
              
              </Typography>
              <Typography variant="h6" color="text.secondary" paragraph>
                Provide an easy-to-use dashboard or API where an operator can enter asset details (orbit, shielding, value) and instantly view:
              </Typography>
              <ul style={{ color: '#94a3b8', fontSize: '1.1rem', lineHeight: '1.8' }}>
               
              </ul>
            </Box>
          )}

          {/* Render the selected section's component */}
          {sectionComponents[activeFeature]}
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

        @keyframes float {
          0% { 
            transform: translateY(0px) rotate(0deg);
          }
          50% { 
            transform: translateY(-20px) rotate(2deg);
          }
          100% { 
            transform: translateY(0px) rotate(0deg);
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