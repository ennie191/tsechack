import React from 'react'
import { useApp } from '../context/AppContext'
import { Box, Card, CardContent, CardHeader, Grid, Typography } from '@mui/material'
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip, AreaChart, Area } from 'recharts'

function toData(h) {
  if (!h) return []
  return [
    { name: '24h', prob: h.h24.probability, lo: h.h24.ci90[0], hi: h.h24.ci90[1] },
    { name: '48h', prob: h.h48.probability, lo: h.h48.ci90[0], hi: h.h48.ci90[1] },
    { name: '72h', prob: h.h72.probability, lo: h.h72.ci90[0], hi: h.h72.ci90[1] },
  ]
}

export default function ForecastCharts() {
  const { forecast } = useApp()
  const data = forecast ? toData(forecast.horizons) : []

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Storm Probability by Horizon" />
          <CardContent>
            <Box sx={{ width: '100%', height: 240 }}>
              <ResponsiveContainer>
                <BarChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => `${Math.round(v * 100)}%`} domain={[0, 1]} />
                  <Tooltip formatter={(v) => `${Math.round(v * 100)}%`} />
                  <Bar dataKey="prob" fill="#60a5fa" />
                </BarChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
      <Grid item xs={12} md={6}>
        <Card>
          <CardHeader title="Confidence Intervals (CI90)" />
          <CardContent>
            <Box sx={{ width: '100%', height: 240 }}>
              <ResponsiveContainer>
                <AreaChart data={data}>
                  <XAxis dataKey="name" />
                  <YAxis tickFormatter={(v) => `${Math.round(v * 100)}%`} domain={[0, 1]} />
                  <Tooltip formatter={(v) => `${Math.round(v * 100)}%`} />
                  <Area type="monotone" dataKey="lo" stackId="1" stroke="#34d399" fill="#34d39955" />
                  <Area type="monotone" dataKey="hi" stackId="1" stroke="#ef4444" fill="#ef444455" />
                </AreaChart>
              </ResponsiveContainer>
            </Box>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  )
}


