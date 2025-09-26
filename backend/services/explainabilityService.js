function explain({ forecast }) {
  // Placeholder XAI: derive simple feature importances from last observed features
  const s = forecast?.features || {};
  const lastWind = s.solarWindKmPerS?.at?.(-1) ?? 0;
  const lastBz = s.bz?.at?.(-1) ?? 0;
  const lastKp = s.kp?.at?.(-1) ?? 0;

  const importance = [
    { feature: 'solarWindKmPerS', importance: Math.abs(lastWind - 400) / 300 },
    { feature: 'bz', importance: Math.abs(Math.min(0, lastBz)) / 10 },
    { feature: 'kp', importance: Math.abs(lastKp - 3) / 6 }
  ];

  const total = importance.reduce((a, b) => a + b.importance, 0) || 1;
  const normalized = importance.map(i => ({ ...i, weight: i.importance / total }));

  const summary = `Forecast driven by solar wind ${(lastWind).toFixed(0)} km/s, IMF Bz ${(lastBz).toFixed(1)} nT, Kp ${(lastKp).toFixed(1)}.`;

  return { importance: normalized, summary };
}

module.exports = { explain };


