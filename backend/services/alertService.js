const subscribers = [];
let recentAlerts = [];

function subscribe({ channels = ['dashboard'], thresholds = { kp: 6 }, contact = {} }) {
  const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  subscribers.push({ id, channels, thresholds, contact });
  return { ok: true, id };
}

function pushAlert(alert) {
  recentAlerts.unshift({ ...alert, at: new Date().toISOString() });
  recentAlerts = recentAlerts.slice(0, 50);
  // In production, fan out to email/SMS/push providers
}

function fetchRecent() {
  return recentAlerts;
}

module.exports = { subscribe, pushAlert, fetchRecent };


