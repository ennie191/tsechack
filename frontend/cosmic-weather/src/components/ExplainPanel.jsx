import React from 'react'
import { useApp } from '../context/AppContext'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  LinearProgress, 
  Stack, 
  Typography, 
  Box,
  Chip,
  alpha,
  useTheme
} from '@mui/material'
import { Lightbulb, Analytics, Psychology } from '@mui/icons-material'

export default function ExplainPanel() {
  const { explain } = useApp()
  const theme = useTheme()

  const getImportanceColor = (weight) => {
    if (weight > 0.7) return '#ef4444'
    if (weight > 0.4) return '#f59e0b'
    return '#10b981'
  }

  return (
    <Card>
      <CardHeader 
        title={
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Psychology /> AI Insights
          </Typography>
        }
        subheader="Transparent risk assessment explanation"
      />
      <CardContent>
        {explain ? (
          <Stack spacing={3}>
            {/* Summary */}
            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              bgcolor: alpha(theme.palette.info.main, 0.08),
              border: `1px solid ${alpha(theme.palette.info.main, 0.2)}`
            }}>
              <Typography variant="body2" sx={{ fontStyle: 'italic' }}>
                "{explain.summary}"
              </Typography>
            </Box>

            {/* Feature Importance */}
            <Stack spacing={2}>
              <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Analytics fontSize="small" /> Key Risk Factors
              </Typography>
              
              {explain.importance?.map((item, index) => (
                <Box key={index}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center" mb={1}>
                    <Typography variant="caption" fontWeight="500">
                      {item.feature.replace(/([A-Z])/g, ' $1').trim()}
                    </Typography>
                    <Chip 
                      label={`${Math.round(item.weight * 100)}%`} 
                      size="small"
                      sx={{ 
                        bgcolor: alpha(getImportanceColor(item.weight), 0.1),
                        color: getImportanceColor(item.weight),
                        fontWeight: 600
                      }}
                    />
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={Math.min(100, Math.round(item.weight * 100))} 
                    sx={{ 
                      height: 6, 
                      borderRadius: 3,
                      bgcolor: alpha(theme.palette.primary.main, 0.1),
                      '& .MuiLinearProgress-bar': {
                        bgcolor: getImportanceColor(item.weight),
                        borderRadius: 3,
                      }
                    }} 
                  />
                </Box>
              ))}
            </Stack>
          </Stack>
        ) : (
          <Stack spacing={2} alignItems="center" sx={{ py: 3 }}>
            <Lightbulb sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5 }} />
            <Typography variant="body2" color="text.secondary" textAlign="center">
              Analyzing risk factors and generating insights...
            </Typography>
            <LinearProgress sx={{ width: '100%', height: 6, borderRadius: 3 }} />
          </Stack>
        )}
      </CardContent>
    </Card>
  )
}