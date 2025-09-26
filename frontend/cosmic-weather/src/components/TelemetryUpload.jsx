import React from 'react'
import { useState } from 'react'
import { TelemetryAPI } from '../services/api'
import { 
  Box, 
  Button, 
  Card, 
  CardContent, 
  CardHeader, 
  LinearProgress, 
  Stack, 
  Typography,
  Chip,
  alpha,
  useTheme
} from '@mui/material'
import { CloudUpload, Analytics, CheckCircle, Error } from '@mui/icons-material'

export default function TelemetryUpload() {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const theme = useTheme()

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    
    setUploading(true)
    setError(null)
    setResult(null)
    
    try {
      const text = await file.text()
      let telemetry = []
      
      try { 
        telemetry = JSON.parse(text) 
      } catch { 
        telemetry = text.split('\n').filter(Boolean).map((line) => ({ 
          line, 
          anomaly: /anomaly|error|fault/i.test(line) 
        })) 
      }
      
      const data = await TelemetryAPI.upload('demo-asset', telemetry)
      setResult(data)
    } catch (err) {
      setError(err?.message || 'Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const getVulnerabilityColor = (score) => {
    if (score > 0.7) return '#ef4444'
    if (score > 0.4) return '#f59e0b'
    return '#10b981'
  }

  return (
    <Card>
      <CardHeader 
        title={
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <CloudUpload /> Telemetry Analysis
          </Typography>
        }
        subheader="Upload logs for personalized risk assessment"
      />
      <CardContent>
        <Stack spacing={3}>
          {/* Upload Button */}
          <Button 
            component="label" 
            variant="outlined"
            startIcon={<CloudUpload />}
            disabled={uploading}
            sx={{
              border: `2px dashed ${alpha(theme.palette.primary.main, 0.3)}`,
              py: 2,
              borderRadius: 3,
              '&:hover': {
                border: `2px dashed ${theme.palette.primary.main}`,
                bgcolor: alpha(theme.palette.primary.main, 0.05),
              }
            }}
          >
            {uploading ? 'Processing...' : 'Choose Telemetry File'}
            <input hidden type="file" onChange={handleUpload} accept=".json,.txt,.log" />
          </Button>

          {/* Progress */}
          {uploading && (
            <Box>
              <Typography variant="caption" color="text.secondary" gutterBottom>
                Analyzing telemetry data...
              </Typography>
              <LinearProgress 
                sx={{ 
                  height: 6, 
                  borderRadius: 3,
                  '& .MuiLinearProgress-bar': {
                    bgcolor: 'linear-gradient(45deg, #60a5fa 30%, #a78bfa 90%)',
                  }
                }} 
              />
            </Box>
          )}

          {/* Results */}
          {result && (
            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              bgcolor: alpha('#10b981', 0.08),
              border: `1px solid ${alpha('#10b981', 0.2)}`
            }}>
              <Stack spacing={1}>
                <Typography variant="subtitle2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <CheckCircle color="success" /> Analysis Complete
                </Typography>
                
                <Stack direction="row" spacing={2} alignItems="center">
                  <Box>
                    <Typography variant="caption" color="text.secondary">Vulnerability Score</Typography>
                    <Chip 
                      label={`${(result.vulnerabilityScore * 100).toFixed(0)}%`} 
                      size="small"
                      sx={{ 
                        bgcolor: alpha(getVulnerabilityColor(result.vulnerabilityScore), 0.1),
                        color: getVulnerabilityColor(result.vulnerabilityScore),
                        fontWeight: 600
                      }}
                    />
                  </Box>
                  
                  <Box>
                    <Typography variant="caption" color="text.secondary">Anomaly Rate</Typography>
                    <Chip 
                      label={`${(result.anomalyRate * 100).toFixed(1)}%`} 
                      size="small"
                      variant="outlined"
                    />
                  </Box>
                </Stack>
              </Stack>
            </Box>
          )}

          {/* Error */}
          {error && (
            <Box sx={{ 
              p: 2, 
              borderRadius: 2, 
              bgcolor: alpha('#ef4444', 0.08),
              border: `1px solid ${alpha('#ef4444', 0.2)}`
            }}>
              <Typography variant="body2" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Error color="error" /> {error}
              </Typography>
            </Box>
          )}

          {/* Info */}
          <Typography variant="caption" color="text.secondary" textAlign="center">
            Supports JSON, TXT, and LOG files. File analysis helps personalize your risk model.
          </Typography>
        </Stack>
      </CardContent>
    </Card>
  )
}