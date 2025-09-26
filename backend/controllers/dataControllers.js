const ForecastService = require('../services/forecastService');
const LossModelService = require('../services/lossModelService');
const PremiumService = require('../services/premiumService');
const AlertService = require('../services/alertService');
const ExplainabilityService = require('../services/explainabilityService');
const VulnerabilityService = require('../services/vulnerabilityService');

async function getForecast(req, res) {
  try {
    const { altitude, shieldingLevel, assetValue } = req.query;
    const data = await ForecastService.generateForecast({
      altitude,
      shieldingLevel: Number(shieldingLevel),
      assetValue: Number(assetValue)
    });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate forecast' });
  }
}

async function getLossModel(req, res) {
  try {
    const { forecast, asset } = req.body;
    const data = await LossModelService.deriveLossDistribution({ forecast, asset });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to compute loss model' });
  }
}

async function getPremiumQuote(req, res) {
  try {
    const { lossDistribution, riskLoad, confidenceLevel } = req.body;
    const data = await PremiumService.calculatePremium({ lossDistribution, riskLoad, confidenceLevel });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to calculate premium' });
  }
}

async function postSubscribeAlerts(req, res) {
  try {
    const { channels, thresholds, contact } = req.body;
    const data = await AlertService.subscribe({ channels, thresholds, contact });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to subscribe to alerts' });
  }
}

async function getAlerts(req, res) {
  try {
    const data = await AlertService.fetchRecent();
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch alerts' });
  }
}

async function postTelemetry(req, res) {
  try {
    const { assetId, telemetry } = req.body;
    const data = await VulnerabilityService.ingestTelemetry({ assetId, telemetry });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to ingest telemetry' });
  }
}

async function getExplainability(req, res) {
  try {
    let { forecast } = req.query;
    let parsed = forecast;
    if (typeof forecast === 'string') {
      try {
        parsed = JSON.parse(forecast);
      } catch (_) {
        parsed = undefined;
      }
    }
    const data = await ExplainabilityService.explain({ forecast: parsed });
    res.json(data);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to generate explanation' });
  }
}

module.exports = {
  getForecast,
  getLossModel,
  getPremiumQuote,
  postSubscribeAlerts,
  getAlerts,
  postTelemetry,
  getExplainability
};


