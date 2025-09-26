function deriveLossDistribution({ forecast, asset }) {
  const assetValue = Number(asset?.value || 100_000_000);
  const severity = forecast?.horizons?.h24?.probability || 0.2;
  // Simple tiered distribution influenced by severity
  const minor = { loss: Math.round(assetValue * 0.01), probability: Math.min(0.9, 0.6 + severity * 0.3) };
  const moderate = { loss: Math.round(assetValue * 0.1), probability: Math.min(0.3, 0.3 + severity * 0.2) };
  const severe = { loss: Math.round(assetValue * 0.5), probability: Math.max(0.05, 0.1 + severity * 0.1) };

  const normalized = normalize([minor, moderate, severe]);
  const expectedLoss = normalized.reduce((acc, t) => acc + t.loss * t.probability, 0);

  return {
    tiers: normalized,
    expectedLoss,
    assumptions: { assetValue }
  };
}

function normalize(tiers) {
  const sum = tiers.reduce((acc, t) => acc + t.probability, 0);
  if (sum === 0) return tiers;
  return tiers.map(t => ({ ...t, probability: t.probability / sum }));
}

module.exports = { deriveLossDistribution };


