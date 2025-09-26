import React from 'react'
import { useApp } from '../context/AppContext'
import { 
  Box, 
  Card, 
  CardContent, 
  CardHeader, 
  Grid, 
  Typography,
  alpha,
  useTheme  // FIXED: Added missing import
} from '@mui/material'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area, Cell } from 'recharts'
import { TrendingUp, Analytics } from '@mui/icons-material'

function toData(h) {
  if (!h) return []
  return [
    { name: '24H', prob: h.h24.probability, lo: h.h24.ci90[0], hi: h.h24.ci90[1], color: '#60a5fa' },
    { name: '48H', prob: h.h48.probability, lo: h.h48.ci90[0], hi: h.h48.ci90[1], color: '#a78bfa' },
    { name: '72H', prob: h.h72.probability, lo: h.h72.ci90[0], hi: h.h72.ci90[1], color: '#f472b6' },
  ]
}

// FIXED: Added theme parameter to CustomTooltip
const CustomTooltip = ({ active, payload, label }) => {
  const theme = useTheme()  // FIXED: Now using useTheme hook properly
  
  if (active && payload && payload.length) {
    return (
      <Box
        sx={{
          background: alpha(theme.palette.background.paper, 0.95),
          border: `1px solid ${alpha(theme.palette.primary.main, 0.2)}`,
          borderRadius: 2,
          p: 2,
          boxShadow: theme.shadows[4]
        }}
      >
        <Typography variant="subtitle2" gutterBottom sx={{ color: theme.palette.primary.main }}>
          {label} Forecast
        </Typography>
        {payload.map((entry, index) => (
          <Typography key={index} variant="body2" sx={{ color: entry.color }}>
            {entry.name}: {Math.round(entry.value * 100)}%
          </Typography>
        ))}
      </Box>
    )
  }
  return null
}

export default function ForecastCharts() {
  const { forecast } = useApp()
  const theme = useTheme()
  const data = forecast ? toData(forecast.horizons) : []

  return (
    <Grid container spacing={3}>
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardHeader 
            title={
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <TrendingUp /> Storm Probability
              </Typography>
            }
            subheader="Probability by time horizon"
          />
          <CardContent>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <BarChart data={data}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis 
                    tickFormatter={(v) => `${Math.round(v * 100)}%`} 
                    domain={[0, 1]} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Bar dataKey="prob" radius={[4, 4, 0, 0]}>
                    {data.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      
      <Grid item xs={12} md={6}>
        <Card sx={{ height: '100%' }}>
          <CardHeader 
            title={
              <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Analytics /> Confidence Intervals
              </Typography>
            }
            subheader="90% confidence range"
          />
          <CardContent>
            <Box sx={{ width: '100%', height: 300 }}>
              <ResponsiveContainer>
                <AreaChart data={data}>
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis 
                    tickFormatter={(v) => `${Math.round(v * 100)}%`} 
                    domain={[0, 1]} 
                    axisLine={false}
                    tickLine={false}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <defs>
                    <linearGradient id="lowGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#34d399" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#34d399" stopOpacity={0.1}/>
                    </linearGradient>
                    <linearGradient id="highGradient" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#ef4444" stopOpacity={0.8}/>
                      <stop offset="95%" stopColor="#ef4444" stopOpacity={0.1}/>
                    </linearGradient>
                  </defs>
                  <Area 
                    type="monotone" 
                    dataKey="lo" 
                    stackId="1" 
                    stroke="#34d399" 
                    fill="url(#lowGradient)" 
                    strokeWidth={2}
                  />
                  <Area 
                    type="monotone" 
                    dataKey="hi" 
                    stackId="1" 
                    stroke="#ef4444" 
                    fill="url(#highGradient)" 
                    strokeWidth={2}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}