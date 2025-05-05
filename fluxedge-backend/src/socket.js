const si = require('systeminformation');

function initSocket(io) {
  io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    const interval = setInterval(async () => {
      try {
        const networkStats = await si.networkStats();
        const stats = networkStats[0]; // Assuming a single network interface
        socket.emit('networkStats', {
          rx_sec: (stats.rx_sec / 1024).toFixed(2), // Convert to KB/s
          tx_sec: (stats.tx_sec / 1024).toFixed(2), // Convert to KB/s
          rx_total: (stats.rx / (1024 * 1024)).toFixed(2), // Convert to MB
          tx_total: (stats.tx / (1024 * 1024)).toFixed(2), // Convert to MB
        });
      } catch (err) {
        console.error('Error fetching network stats:', err);
      }
    }, 1000); // Emit data every second

    socket.on('disconnect', () => {
      clearInterval(interval);
      console.log('Client disconnected:', socket.id);
    });
  });
}

module.exports = { initSocket };
