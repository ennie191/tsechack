import React from 'react'
import { useApp } from '../context/AppContext'
import { Card, CardContent, CardHeader, Stack, Typography } from '@mui/material'

export default function PremiumCard() {
  const { premium } = useApp()
  return (
    <Card>
      <CardHeader title="Recommended Premium" />
      <CardContent>
        {premium ? (
          <Stack spacing={1}>
            <Typography variant="body2">Expected Loss: ${premium.expectedLoss.toLocaleString()}</Typography>
            <Typography variant="body2">Pure Premium: ${premium.purePremium.toLocaleString()}</Typography>
            <Typography variant="h6">Premium: ${premium.premium.toLocaleString()}</Typography>
            <Typography variant="caption" color="text.secondary">
              Assumptions: Risk load {Math.round(premium.assumptions.riskLoad * 100)}%, CI {Math.round(premium.assumptions.confidenceLevel * 100)}%
            </Typography>
          </Stack>
        ) : (
          <Typography variant="body2" color="text.secondary">Calculating…</Typography>
        )}
      </CardContent>
    </Card>
  )
}


