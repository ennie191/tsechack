import React from 'react'
import { useEffect } from 'react'
import { useApp } from '../context/AppContext'
import { AlertsAPI } from '../services/api'
import { 
  Card, 
  CardContent, 
  CardHeader, 
  List, 
  ListItem, 
  ListItemText, 
  Stack, 
  Typography,
  Chip,
  Box,
  alpha,
  IconButton
} from '@mui/material'
import { SnackbarProvider, useSnackbar } from 'notistack'
import { Warning, Notifications, Email, Sms, Close, Schedule } from '@mui/icons-material'

// Custom snackbar component
function AlertToast({ id, message, variant = 'warning' }) {
  const { closeSnackbar } = useSnackbar()
  const theme = useTheme()

  const getAlertConfig = () => {
    switch (variant) {
      case 'error': return { icon: Warning, color: '#ef4444', label: 'Critical' }
      case 'success': return { icon: Warning, color: '#10b981', label: 'Info' }
      case 'info': return { icon: Warning, color: '#60a5fa', label: 'Notice' }
      default: return { icon: Warning, color: '#f59e0b', label: 'Warning' }
    }
  }

  const config = getAlertConfig()
  const IconComponent = config.icon

  return (
    <Box
      sx={{
        background: theme.palette.background.paper,
        border: `1px solid ${alpha(config.color, 0.3)}`,
        borderLeft: `4px solid ${config.color}`,
        borderRadius: 2,
        p: 2,
        minWidth: 300,
        boxShadow: theme.shadows[4],
        display: 'flex',
        alignItems: 'flex-start',
        gap: 2
      }}
    >
      <IconComponent sx={{ color: config.color, mt: 0.5 }} />
      
      <Box sx={{ flex: 1 }}>
        <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
          <Chip label={config.label} size="small" sx={{ bgcolor: alpha(config.color, 0.1), color: config.color }} />
          <Typography variant="caption" color="text.secondary">
            Just now
          </Typography>
        </Stack>
        <Typography variant="body2">{message}</Typography>
      </Box>
      
      <IconButton size="small" onClick={() => closeSnackbar(id)} sx={{ mt: -0.5, mr: -0.5 }}>
        <Close fontSize="small" />
      </IconButton>
    </Box>
  )
}

function AlertsToastsInner() {
  const { alerts } = useApp()
  const { enqueueSnackbar } = useSnackbar()

  useEffect(() => {
    if (!alerts || !alerts.length) return
    const lastAlert = alerts[0]
    if (lastAlert && lastAlert.message) {
      enqueueSnackbar(lastAlert.message, { 
        variant: 'warning',
        content: (key, message) => <AlertToast id={key} message={message} variant="warning" />
      })
    }
  }, [alerts, enqueueSnackbar])

  return null
}

export function AlertsToasts() {
  return (
    <SnackbarProvider 
      maxSnack={3} 
      autoHideDuration={6000} 
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      Components={{
        warning: AlertToast,
        error: AlertToast,
        success: AlertToast,
        info: AlertToast,
      }}
    >
      <AlertsToastsInner />
    </SnackbarProvider>
  )
}

export function AlertsPanel() {
  const { alerts } = useApp()

  const getAlertIcon = (type) => {
    switch (type) {
      case 'email': return <Email fontSize="small" />
      case 'sms': return <Sms fontSize="small" />
      default: return <Notifications fontSize="small" />
    }
  }

  return (
    <Card>
      <CardHeader 
        title={
          <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Warning /> Alerts History
          </Typography>
        }
        subheader="Real-time monitoring and notifications"
      />
      <CardContent>
        {alerts && alerts.length ? (
          <List dense sx={{ maxHeight: 400, overflow: 'auto' }}>
            {alerts.map((alert, index) => (
              <ListItem 
                key={index} 
                sx={{ 
                  borderLeft: `3px solid ${index === 0 ? '#f59e0b' : '#6b7280'}`,
                  mb: 1,
                  borderRadius: 1,
                  bgcolor: index === 0 ? alpha('#f59e0b', 0.05) : 'transparent'
                }}
              >
                <ListItemText 
                  primary={
                    <Stack direction="row" alignItems="center" spacing={1} mb={0.5}>
                      {getAlertIcon(alert.type)}
                      <Typography variant="body2" fontWeight={index === 0 ? 600 : 400}>
                        {alert.message || 'Space weather alert'}
                      </Typography>
                      {index === 0 && <Chip label="New" size="small" color="warning" />}
                    </Stack>
                  } 
                  secondary={
                    <Stack direction="row" alignItems="center" spacing={1}>
                      <Schedule fontSize="small" sx={{ fontSize: 12 }} />
                      <Typography variant="caption" color="text.secondary">
                        {alert.at}
                      </Typography>
                    </Stack>
                  } 
                />
              </ListItem>
            ))}
          </List>
        ) : (
          <Box textAlign="center" sx={{ py: 4 }}>
            <Notifications sx={{ fontSize: 48, color: 'text.secondary', opacity: 0.5, mb: 2 }} />
            <Typography variant="body2" color="text.secondary">
              No alerts detected. Monitoring space weather conditions...
            </Typography>
          </Box>
        )}
      </CardContent>
    </Card>
  )
}

export async function simulateSubscription() {
  try {
    await AlertsAPI.subscribe({ 
      channels: ['dashboard', 'email', 'sms'], 
      thresholds: { kp: 6 }, 
      contact: { email: 'ops@example.com', phone: '+10000000000' } 
    })
  } catch (error) {
    console.error('Subscription failed:', error)
  }
}