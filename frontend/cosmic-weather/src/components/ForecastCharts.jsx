// components/CompactChart.jsx
import React from 'react'
import { Box, Typography } from '@mui/material'
import { ResponsiveContainer, LineChart, Line, XAxis, YAxis, Tooltip } from 'recharts'

export default function CompactChart({ inputs }) {
  // Example: Make probability depend on shielding and value
  // You can replace this logic with your real model
  const baseProb = 10
  const shielding = Number(inputs?.shielding || 1)
  const value = Number(inputs?.value || 0)
  const orbitFactor = inputs?.orbit === 'LEO' ? 1.2 : inputs?.orbit === 'MEO' ? 1.1 : 1

  const chartData = [
    { period: '24H', probability: Math.round(baseProb + shielding * orbitFactor + value / 10000000) },
    { period: '48H', probability: Math.round(baseProb + shielding * orbitFactor * 0.9 + value / 12000000) },
    { period: '72H', probability: Math.round(baseProb + shielding * orbitFactor * 0.8 + value / 15000000) }
  ]

  return (
    <Box sx={{ width: '100%', height: 200 }}>
      <Typography variant="h6" sx={{ color: '#e5e7eb', textAlign: 'center', mb: 1 }}>
        Storm Probability Trend
      </Typography>
      <ResponsiveContainer width="100%" height="80%">
        <LineChart data={chartData}>
          <XAxis 
            dataKey="period" 
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8' }}
          />
          <YAxis 
            domain={[0, 100]}
            axisLine={false}
            tickLine={false}
            tick={{ fill: '#94a3b8' }}
            tickFormatter={(value) => `${value}%`}
          />
          <Tooltip 
            formatter={(value) => [`${value}%`, 'Probability']}
            labelFormatter={(label) => `Time: ${label}`}
            contentStyle={{
              background: '#23233a',
              border: '1px solid #4f46e5',
              borderRadius: '8px',
              color: '#e5e7eb'
            }}
          />
          <Line 
            type="monotone" 
            dataKey="probability" 
            stroke="#4f46e5"
            strokeWidth={3}
            dot={{ fill: '#7c3aed', strokeWidth: 2, r: 4 }}
            activeDot={{ r: 6, fill: '#a78bfa' }}
          />
        </LineChart>
      </ResponsiveContainer>
    </Box>
  )
}