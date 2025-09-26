import { useApp } from '../context/AppContext'
import { Box, Button, FormControl, InputLabel, MenuItem, Select, Slider, Stack, Switch, Typography } from '@mui/material'

export default function Controls() {
  const { altitude, setAltitude, shieldingLevel, setShieldingLevel, assetValue, setAssetValue, darkMode, setDarkMode, loading, refresh } = useApp()

  return (
    <Box component="section" sx={{ p: 2 }}>
      <Stack direction={{ xs: 'column', md: 'row' }} spacing={2} alignItems="center">
        <FormControl size="small" sx={{ minWidth: 140 }}>
          <InputLabel id="alt-label">Altitude</InputLabel>
          <Select labelId="alt-label" label="Altitude" value={altitude} onChange={(e) => setAltitude(e.target.value)}>
            <MenuItem value="LEO">LEO</MenuItem>
            <MenuItem value="MEO">MEO</MenuItem>
            <MenuItem value="GEO">GEO</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ minWidth: 220 }}>
          <Typography variant="caption" color="text.secondary">Shielding Level: {shieldingLevel}</Typography>
          <Slider value={shieldingLevel} onChange={(_, v) => setShieldingLevel(v)} min={1} max={5} step={1} marks valueLabelDisplay="auto" />
        </Box>

        <Box sx={{ minWidth: 280 }}>
          <Typography variant="caption" color="text.secondary">Asset Value: ${assetValue.toLocaleString()}</Typography>
          <Slider value={assetValue} onChange={(_, v) => setAssetValue(v)} min={10_000_000} max={1_000_000_000} step={1_000_000} valueLabelDisplay="auto" />
        </Box>

        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="caption">Light</Typography>
          <Switch checked={darkMode} onChange={(e) => setDarkMode(e.target.checked)} />
          <Typography variant="caption">Dark</Typography>
        </Stack>

        <Button variant="contained" onClick={refresh} disabled={loading}>Refresh</Button>
      </Stack>
    </Box>
  )
}


