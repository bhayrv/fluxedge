const router = require('express').Router();
const { verifyToken } = require('../middleware/authMiddleware');

// GET /api/logs
router.get('/', verifyToken, (req, res) => {
  const logs = [
    { id: 1, message: 'Server 1 restarted', time: '10:15' },
    { id: 2, message: 'Disk check completed on Server 3', time: '10:45' },
  ];
  res.json(logs);
});

module.exports = router;
