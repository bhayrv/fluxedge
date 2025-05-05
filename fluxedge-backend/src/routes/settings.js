const router = require('express').Router();
const { verifyToken } = require('../middleware/authMiddleware');

let userSettings = {
  theme: 'light',
  notifications: true,
  refreshInterval: 30,
};

router.get('/', verifyToken, (req, res) => {
  res.json(userSettings);
});

router.put('/', verifyToken, (req, res) => {
  userSettings = { ...userSettings, ...req.body };
  res.json({ message: 'Settings updated successfully', settings: userSettings });
});

module.exports = router;
