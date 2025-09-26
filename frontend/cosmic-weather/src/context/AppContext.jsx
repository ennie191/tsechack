import { createContext, useContext, useEffect, useMemo, useRef, useState } from 'react'
import { AlertsAPI, ExplainAPI, ForecastAPI, LossAPI, PremiumAPI } from '../services/api'

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

  const asset = useMemo(() => ({ value: assetValue, altitude, shieldingLevel }), [altitude, shieldingLevel, assetValue])

  const debounceRef = useRef(null)
  const refresh = async () => {
    setLoading(true)
    setError(null)
    try {
      const f = await ForecastAPI.get({ altitude, shieldingLevel, assetValue })
      setForecast(f)
      const l = await LossAPI.post({ forecast: f, asset })
      setLoss(l)
      const p = await PremiumAPI.post({ lossDistribution: l, riskLoad: 0.2, confidenceLevel: 0.9 })
      setPremium(p)
      const e = await ExplainAPI.get(f)
      setExplain(e)
    } catch (err) {
      setError(err?.message || 'Failed to refresh')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    refresh()
    const poll = setInterval(async () => {
      const data = await AlertsAPI.list()
      setAlerts(data)
    }, 10000)
    return () => clearInterval(poll)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current)
    debounceRef.current = setTimeout(() => { refresh() }, 400)
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [altitude, shieldingLevel, assetValue])

  const value = {
    altitude, setAltitude,
    shieldingLevel, setShieldingLevel,
    assetValue, setAssetValue,
    darkMode, setDarkMode,
    forecast, loss, premium, explain, alerts,
    loading, error,
    refresh
  }

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>
}

export function useApp() {
  return useContext(AppCtx)
}


