const router = require('express').Router();
const { verifyToken } = require('../middleware/authMiddleware');

router.get('/', verifyToken, (req, res) => {
  const servers = [
    { id: 1, name: 'Server 1', ip: '192.168.1.1', status: 'online' },
    { id: 2, name: 'Server 2', ip: '192.168.1.2', status: 'offline' },
    { id: 3, name: 'Server 3', ip: '192.168.1.3', status: 'online' },
  ];
  res.json(servers);
});

module.exports = router;
