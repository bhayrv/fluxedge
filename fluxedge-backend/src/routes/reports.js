const router = require('express').Router();
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, (req, res) => {
  const reports = [
    {
      id: 1,
      serverName: 'Server 1',
      uptime: '24 days',
      cpuUsage: '45%',
      memoryUsage: '60%',
      generatedTime: new Date(),
    },
    {
      id: 2,
      serverName: 'Server 2',
      uptime: '12 days',
      cpuUsage: '30%',
      memoryUsage: '50%',
      generatedTime: new Date(),
    },
    {
      id: 3,
      serverName: 'Server 3',
      uptime: '7 days',
      cpuUsage: '70%',
      memoryUsage: '80%',
      generatedTime: new Date(),
    },
  ];
  res.json(reports);
});

module.exports = router;
