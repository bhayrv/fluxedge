const router = require('express').Router();
const metricsController = require('../controllers/metricsController');

router.get('/summary', metricsController.getSummary);
router.get('/timeseries', metricsController.getTimeseries);
router.get('/predict', metricsController.getPrediction);

module.exports = router;
