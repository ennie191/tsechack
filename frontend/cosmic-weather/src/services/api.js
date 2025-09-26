import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:4000/api',
  timeout: 15000,
})

export const ForecastAPI = {
  get: (params) => api.get('/forecast', { params }).then(r => r.data),
}

export const LossAPI = {
  post: (payload) => api.post('/loss-model', payload).then(r => r.data),
}

export const PremiumAPI = {
  post: (payload) => api.post('/premium', payload).then(r => r.data),
}

export const AlertsAPI = {
  list: () => api.get('/alerts').then(r => r.data),
  subscribe: (payload) => api.post('/alerts/subscribe', payload).then(r => r.data),
}

export const ExplainAPI = {
  get: (forecast) => api.get('/explain', { params: { forecast: JSON.stringify(forecast) } }).then(r => r.data),
}

export const TelemetryAPI = {
  upload: (assetId, telemetry) => api.post('/telemetry', { assetId, telemetry }).then(r => r.data),
}

export default api


