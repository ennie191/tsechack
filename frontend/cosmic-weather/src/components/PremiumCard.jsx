import React from 'react'
import { useApp } from '../context/AppContext'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  Stack, 
  Typography, 
  Box,
  LinearProgress,
  Chip,
  alpha,
  useTheme
} from '@mui/material'
import { MonetizationOn, TrendingUp, Assessment } from '@mui/icons-material'

export default function PremiumCard() {
  const { premium } = useApp()
  const theme = useTheme()

  if (!premium) {
    return (
      <Card>
        <CardContent>
          <Stack spacing={2} alignItems="center">
            <Assessment sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
            <Typography variant="body2" color="text.secondary">
              Calculating premium...
            </Typography>
            <LinearProgress sx={{ width: '100%', height: 6, borderRadius: 3 }} />
          </Stack>
        </CardContent>
      </Card>
    )
  }

  const riskLevel = premium.premium / premium.expectedLoss > 1.5 ? 'High' : 
                   premium.premium / premium.expectedLoss > 1.2 ? 'Medium' : 'Low'

  const riskColor = riskLevel === 'High' ? '#ef4444' : riskLevel === 'Medium' ? '#f59e0b' : '#10b981'

  return (
    <Card>
      <CardHeader 
        title={
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <MonetizationOn /> Recommended Premium
          </Typography>
        }
        subheader="AI-powered risk assessment"
      />
      <CardContent>
        <Stack spacing={3}>
          {/* Main Premium Display */}
          <Box sx={{ textAlign: 'center', py: 2 }}>
            <Typography variant="h4" fontWeight="800" sx={{ 
              background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
              backgroundClip: 'text',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              ${premium.premium.toLocaleString()}
            </Typography>
            <Chip 
              label={`${riskLevel} Risk`} 
              size="small" 
              sx={{ 
                bgcolor: alpha(riskColor, 0.1), 
                color: riskColor,
                mt: 1,
                fontWeight: 600
              }} 
            />
          </Box>

          {/* Breakdown */}
          <Stack spacing={1.5}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <TrendingUp fontSize="small" /> Expected Loss
              </Typography>
              <Typography variant="body2" fontWeight="600">
                ${premium.expectedLoss.toLocaleString()}
              </Typography>
            </Box>
            
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <Typography variant="body2">Pure Premium</Typography>
              <Typography variant="body2" color="text.secondary">
                ${premium.purePremium.toLocaleString()}
              </Typography>
            </Box>

            <Box sx={{ 
              p: 1.5, 
              borderRadius: 2, 
              bgcolor: alpha(theme.palette.primary.main, 0.05),
              border: `1px solid ${alpha(theme.palette.primary.main, 0.1)}`
            }}>
              <Typography variant="caption" color="text.secondary">
                Risk Load: {Math.round(premium.assumptions.riskLoad * 100)}% • 
                CI: {Math.round(premium.assumptions.confidenceLevel * 100)}%
              </Typography>
            </Box>
          </Stack>
        </Stack>
      </CardContent>
    </Card>
  )
}