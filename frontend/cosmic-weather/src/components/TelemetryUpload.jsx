import React from 'react'
import { useState } from 'react'
import { TelemetryAPI } from '../services/api'
import { Box, Button, Card, CardContent, CardHeader, LinearProgress, Stack, Typography } from '@mui/material'

export default function TelemetryUpload() {
  const [uploading, setUploading] = useState(false)
  const [result, setResult] = useState(null)

  async function handleUpload(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setUploading(true)
    try {
      const text = await file.text()
      // Simulate parse into JSON array of events with anomaly flags if possible
      let telemetry = []
      try { telemetry = JSON.parse(text) } catch { telemetry = text.split('\n').filter(Boolean).map((line) => ({ line, anomaly: /anomaly|error|fault/i.test(line) })) }
      const data = await TelemetryAPI.upload('demo-asset', telemetry)
      setResult(data)
    } finally {
      setUploading(false)
    }
  }

  return (
    <Card>
      <CardHeader title="Telemetry Upload" subheader="Upload logs to personalize vulnerability modeling" />
      <CardContent>
        <Stack spacing={2}>
          <Box>
            <Button component="label" variant="outlined">
              Choose File
              <input hidden type="file" onChange={handleUpload} />
            </Button>
          </Box>
          {uploading && <LinearProgress />}
          {result && (
            <Typography variant="body2">Vulnerability Score: {(result.vulnerabilityScore*100).toFixed(0)}% — Anomaly Rate: {(result.anomalyRate*100).toFixed(1)}%</Typography>
          )}
        </Stack>
      </CardContent>
    </Card>
  )
}


