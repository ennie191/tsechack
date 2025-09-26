import React from 'react'
import { useApp } from '../context/AppContext'
import { 
  Box, 
  Button, 
  FormControl, 
  InputLabel, 
  MenuItem, 
  Select, 
  Slider, 
  Stack, 
  Switch, 
  Typography,
  Paper,
  Chip,
  alpha 
} from '@mui/material'
import { 
  Height, // Fixed: Replaced AltitudeIcon with Height
  Shield, 
  MonetizationOn, 
  Refresh,
  LightMode,
  DarkMode 
} from '@mui/icons-material'

export default function Controls() {
  const { altitude, setAltitude, shieldingLevel, setShieldingLevel, assetValue, setAssetValue, darkMode, setDarkMode, loading, refresh } = useApp()

  const altitudeOptions = [
    { value: 'LEO', label: 'Low Earth Orbit', color: '#60a5fa' },
    { value: 'MEO', label: 'Medium Earth Orbit', color: '#a78bfa' },
    { value: 'GEO', label: 'Geostationary Orbit', color: '#f472b6' }
  ]

  return (
    <Paper 
      sx={{ 
        p: 3, 
        mb: 4,
        background: theme => alpha(theme.palette.background.paper, 0.8),
        backdropFilter: 'blur(10px)',
        border: theme => `1px solid ${alpha(theme.palette.primary.main, 0.1)}`,
      }}
    >
      <Stack direction={{ xs: 'column', lg: 'row' }} spacing={3} alignItems="center">
        {/* Altitude Selector */}
        <FormControl size="small" sx={{ minWidth: 160 }}>
          <InputLabel id="altitude-label" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Height fontSize="small" /> Orbit {/* Fixed: Using Height icon */}
          </InputLabel>
          <Select 
            labelId="altitude-label"
            label="Orbit"
            value={altitude}
            onChange={(e) => setAltitude(e.target.value)}
            sx={{ borderRadius: 3 }}
          >
            {altitudeOptions.map(option => (
              <MenuItem key={option.value} value={option.value}>
                <Stack direction="row" alignItems="center" spacing={1}>
                  <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: option.color }} />
                  <Typography>{option.label}</Typography>
                </Stack>
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Rest of the code remains the same */}
        <Box sx={{ minWidth: 200, flex: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Shield fontSize="small" /> Shielding
            </Typography>
            <Chip 
              label={`Level ${shieldingLevel}`} 
              size="small" 
              color="primary"
              variant="outlined"
            />
          </Stack>
          <Slider 
            value={shieldingLevel} 
            onChange={(_, v) => setShieldingLevel(v)} 
            min={1} 
            max={5} 
            step={1} 
            marks
            valueLabelDisplay="auto"
            sx={{ color: '#a78bfa' }}
          />
        </Box>

        <Box sx={{ minWidth: 240, flex: 1 }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
            <Typography variant="caption" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <MonetizationOn fontSize="small" /> Asset Value
            </Typography>
            <Chip 
              label={`$${(assetValue / 1e6).toFixed(0)}M`} 
              size="small" 
              color="secondary"
            />
          </Stack>
          <Slider 
            value={assetValue} 
            onChange={(_, v) => setAssetValue(v)} 
            min={10_000_000} 
            max={1_000_000_000} 
            step={1_000_000}
            valueLabelDisplay="auto"
            valueLabelFormat={v => `$${(v / 1e6).toFixed(0)}M`}
            sx={{ color: '#f472b6' }}
          />
        </Box>

        <Stack direction="row" spacing={1} alignItems="center" sx={{ px: 2 }}>
          <LightMode fontSize="small" sx={{ color: darkMode ? 'text.secondary' : 'warning.main' }} />
          <Switch 
            checked={darkMode} 
            onChange={(e) => setDarkMode(e.target.checked)}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': { color: '#a78bfa' },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': { bgcolor: '#a78bfa' },
            }}
          />
          <DarkMode fontSize="small" sx={{ color: darkMode ? 'primary.main' : 'text.secondary' }} />
        </Stack>

        <Button 
          variant="contained" 
          onClick={refresh} 
          disabled={loading}
          startIcon={<Refresh />}
          sx={{
            background: 'linear-gradient(45deg, #60a5fa 30%, #a78bfa 90%)',
            borderRadius: 3,
            px: 3,
            minWidth: 120,
            '&:hover': {
              transform: 'translateY(-1px)',
              boxShadow: theme => `0 6px 20px ${alpha(theme.palette.primary.main, 0.3)}`,
            },
            transition: 'all 0.2s ease-in-out',
          }}
        >
          {loading ? 'Updating...' : 'Refresh'}
        </Button>
      </Stack>
    </Paper>
  )
}