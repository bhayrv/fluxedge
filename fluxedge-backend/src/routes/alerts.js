const router = require('express').Router();
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, (req, res) => {
  const alerts = [
    {
      id: 1,
      message: 'High CPU usage detected on Server 1',
      severity: 'high',
      timestamp: new Date(),
    },
    {
      id: 2,
      message: 'Disk space running low on Server 2',
      severity: 'medium',
      timestamp: new Date(),
    },
    {
      id: 3,
      message: 'Backup completed successfully on Server 3',
      severity: 'low',
      timestamp: new Date(),
    },
  ];
  res.json(alerts);
});

module.exports = router;
