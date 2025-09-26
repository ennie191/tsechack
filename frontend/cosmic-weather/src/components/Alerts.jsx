import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { AlertsAPI } from '../services/api'
import { Card, CardContent, CardHeader, List, ListItem, ListItemText, Stack, Typography } from '@mui/material'
import { SnackbarProvider, useSnackbar } from 'notistack'

function AlertsToastsInner() {
  const { alerts } = useApp()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (!alerts || !alerts.length) return
    const last = alerts[0]
    if (last && last.message) enqueueSnackbar(last.message, { variant: 'warning' })
  }, [alerts, enqueueSnackbar])

  return null
}

export function AlertsToasts() {
  return (
    <SnackbarProvider maxSnack={3} autoHideDuration={4000} anchorOrigin={{ vertical: 'top', horizontal: 'right' }}>
      <AlertsToastsInner />
    </SnackbarProvider>
  )
}

export function AlertsPanel() {
  const { alerts } = useApp()

  return (
    <Card>
      <CardHeader title="Alerts History" subheader="Includes visual, email, and SMS placeholders" />
      <CardContent>
        {alerts && alerts.length ? (
          <List dense>
            {alerts.map((a, i) => (
              <ListItem key={i} divider>
                <ListItemText primary={a.message || 'Alert'} secondary={a.at} />
              </ListItem>
            ))}
          </List>
        ) : (
          <Typography variant="body2" color="text.secondary">No alerts yet</Typography>
        )}
      </CardContent>
    </Card>
  )
}

export async function simulateSubscription() {
  try {
    await AlertsAPI.subscribe({ channels: ['dashboard', 'email', 'sms'], thresholds: { kp: 6 }, contact: { email: 'ops@example.com', phone: '+10000000000' } })
  } catch {}
}


