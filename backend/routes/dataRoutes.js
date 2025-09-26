const express = require('express');
const router = express.Router();

const {
  getForecast,
  getLossModel,
  getPremiumQuote,
  postSubscribeAlerts,
  getAlerts,
  postTelemetry,
  getExplainability
} = require('../controllers/dataControllers');

router.get('/forecast', getForecast);
router.post('/loss-model', getLossModel);
router.post('/premium', getPremiumQuote);
router.post('/alerts/subscribe', postSubscribeAlerts);
router.get('/alerts', getAlerts);
router.post('/telemetry', postTelemetry);
router.get('/explain', getExplainability);

module.exports = router;


