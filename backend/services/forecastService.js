const axios = require('axios');

async function fetchOmniData() {
  // Placeholder: In production, integrate NASA OMNIWeb and related sources
  // Return synthesized recent KP, Bz, solar wind, proton flux
  return {
    kp: [3.2, 4.0, 4.5, 5.1],
    bz: [-1.2, -3.4, -5.5, -2.1],
    solarWindKmPerS: [380, 420, 510, 600],
    protonFluxPfu: [1.1, 1.4, 1.0, 0.8]
  };
}

function sigmoid(x) {
  return 1 / (1 + Math.exp(-x));
}

async function generateForecast({ altitude, shieldingLevel, assetValue }) {
  const s = await fetchOmniData();
  // Toy probabilistic model using simple features
  const intensityScore = 0.02 * (s.solarWindKmPerS.at(-1) - 400) + 0.5 * Math.min(0, s.bz.at(-1)) + 0.3 * (s.kp.at(-1) - 3);

  const baseProb = sigmoid(intensityScore);

  // Horizon scaling
  const p24 = Math.min(0.99, Math.max(0.01, baseProb));
  const p48 = Math.min(0.99, Math.max(0.01, baseProb * 0.9 + 0.05));
  const p72 = Math.min(0.99, Math.max(0.01, baseProb * 0.8 + 0.08));

  const forecast = {
    horizons: {
      h24: { probability: p24, ci90: [Math.max(0, p24 - 0.1), Math.min(1, p24 + 0.1)] },
      h48: { probability: p48, ci90: [Math.max(0, p48 - 0.12), Math.min(1, p48 + 0.12)] },
      h72: { probability: p72, ci90: [Math.max(0, p72 - 0.15), Math.min(1, p72 + 0.15)] }
    },
    features: s,
    assumptions: { altitude, shieldingLevel, assetValue }
  };
  return forecast;
}

module.exports = { generateForecast };


