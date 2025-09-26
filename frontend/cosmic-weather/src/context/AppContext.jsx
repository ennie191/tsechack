import React from 'react'
import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AlertsAPI, ExplainAPI, ForecastAPI, LossAPI, PremiumAPI } from '../services/api'
import { useSnackbar } from 'notistack'

const AppCtx = createContext(null)

export function AppProvider({ children }) {
  const [altitude, setAltitude] = useState('LEO')
  const [shieldingLevel, setShieldingLevel] = useState(3)
  const [assetValue, setAssetValue] = useState(100_000_000)
  const [darkMode, setDarkMode] = useState(true)

  const [forecast, setForecast] = useState(null)
  const [loss, setLoss] = useState(null)
  const [premium, setPremium] = useState(null)
  const [explain, setExplain] = useState(null)
  const [alerts, setAlerts] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [lastUpdated, setLastUpdated] = useState(null)

  const { enqueueSnackbar } = useSnackbar()
  const asset = useMemo(() => ({ value: assetValue, altitude, shieldingLevel }), [altitude, shieldingLevel, assetValue])

  const debounceRef = useRef(null)
  
  const refresh = async (showNotification = false) => {
    setLoading(true)
    setError(null)
    
    try {
      // Simulate sequential API calls with progress feedback
      const forecastPromise = ForecastAPI.get({ altitude, shieldingLevel, assetValue })
      const forecastData = await forecastPromise
      setForecast(forecastData)

      const lossPromise = LossAPI.post({ forecast: forecastData, asset })
      const lossData = await lossPromise
      setLoss(lossData)

      const premiumPromise = PremiumAPI.post({ lossDistribution: lossData, riskLoad: 0.2, confidenceLevel: 0.9 })
      const premiumData = await premiumPromise
      setPremium(premiumData)

      const explainPromise = ExplainAPI.get(forecastData)
      const explainData = await explainPromise
      setExplain(explainData)

      setLastUpdated(new Date())
      
      if (showNotification) {
        enqueueSnackbar('Data updated successfully', { 
          variant: 'success',
          autoHideDuration: 2000 
        })
      }
    } catch (err) {
      const errorMessage = err?.message || 'Failed to refresh data'
      setError(errorMessage)
      enqueueSnackbar(errorMessage, { 
        variant: 'error',
        persist: true
      })
    } finally {
      setLoading(false)
    }
  }

  // Initial load and polling for alerts
  useEffect(() => {
    let isMounted = true
    
    const initializeApp = async () => {
      try {
        setLoading(true)
        await refresh()
        
        // Initial alerts load
        if (isMounted) {
          const initialAlerts = await AlertsAPI.list()
          setAlerts(initialAlerts)
        }
      } catch (err) {
        if (isMounted) {
          setError('Failed to initialize application')
        }
      } finally {
        if (isMounted) {
          setLoading(false)
        }
      }
    }

    initializeApp()

    // Poll for new alerts every 30 seconds
    const poll = setInterval(async () => {
      if (isMounted) {
        try {
          const newAlerts = await AlertsAPI.list()
          if (isMounted) {
            // Check if we have new alerts
            if (newAlerts.length > alerts.length) {
              const latestAlert = newAlerts[0]
              setAlerts(newAlerts)
              
              // Show toast for the latest alert
              if (latestAlert && latestAlert.message) {
                enqueueSnackbar(latestAlert.message, { 
                  variant: 'warning',
                  autoHideDuration: 5000 
                })
              }
            } else {
              setAlerts(newAlerts)
            }
          }
        } catch (err) {
          console.warn('Failed to fetch alerts:', err)
        }
      }
    }, 30000)

    return () => {
      isMounted = false
      clearInterval(poll)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Debounced refresh when parameters change
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    
    debounceRef.current = setTimeout(() => { 
      refresh() 
    }, 500)
    
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [altitude, shieldingLevel, assetValue])

  // Auto-refresh every 5 minutes
  useEffect(() => {
    const autoRefresh = setInterval(() => {
      refresh(true) // Show notification for auto-refresh
    }, 300000) // 5 minutes

    return () => clearInterval(autoRefresh)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Error recovery - auto-retry after error
  useEffect(() => {
    if (error) {
      const retryTimer = setTimeout(() => {
        setError(null)
        refresh()
      }, 10000) // Retry after 10 seconds

      return () => clearTimeout(retryTimer)
    }
  }, [error])

  const value = useMemo(() => ({
    // State
    altitude, setAltitude,
    shieldingLevel, setShieldingLevel,
    assetValue, setAssetValue,
    darkMode, setDarkMode,
    forecast, loss, premium, explain, alerts,
    loading, error, lastUpdated,
    
    // Actions
    refresh: () => refresh(true),
    
    // Computed values
    hasData: !!(forecast && loss && premium && explain),
    dataAge: lastUpdated ? Math.round((new Date() - lastUpdated) / 1000) : null
  }), [
    altitude, shieldingLevel, assetValue, darkMode,
    forecast, loss, premium, explain, alerts,
    loading, error, lastUpdated
  ])

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export function useApp() {
  const context = useContext(AppCtx)
  if (!context) {
    throw new Error('useApp must be used within an AppProvider')
  }
  return context
}