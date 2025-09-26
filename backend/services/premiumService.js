function calculatePremium({ lossDistribution, riskLoad = 0.15, confidenceLevel = 0.9 }) {
  const tiers = lossDistribution?.tiers || [];
  const expectedLoss = tiers.reduce((acc, t) => acc + t.loss * t.probability, 0);

  // Simple uncertainty uplift based on spread (variance proxy)
  const varianceProxy = tiers.reduce((acc, t) => acc + Math.pow(t.loss - expectedLoss, 2) * t.probability, 0);
  const uncertaintyUplift = Math.sqrt(varianceProxy) * (confidenceLevel - 0.5);

  const purePremium = expectedLoss + uncertaintyUplift;
  const loadedPremium = purePremium * (1 + riskLoad);

  return {
    expectedLoss,
    purePremium: Math.round(purePremium),
    premium: Math.round(loadedPremium),
    assumptions: { riskLoad, confidenceLevel }
  };
}

module.exports = { calculatePremium };


