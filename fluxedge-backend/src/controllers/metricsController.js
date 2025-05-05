const si = require('systeminformation');

exports.getSummary = async (req, res) => {
  try {
    const [cpu, mem] = await Promise.all([si.currentLoad(), si.mem()]);
    const cpuUsage = cpu.currentLoad.toFixed(2) + '%';
    const memUsage = ((mem.active / mem.total) * 100).toFixed(2) + '%';

    const summary = {
      cpuUsage,
      memory: memUsage,
      diskIO: '1 GB/s',
      errorRate: '1.08%',
    };
    res.json(summary);
  } catch (err) {
    console.error('Error fetching metrics:', err);
    res.status(500).json({ message: 'Server error fetching summary' });
  }
};

exports.getTimeseries = async (req, res) => {
  try {
    const timeseries = [];
    const now = new Date();

    // Generate CPU usage data for the past 10 minutes
    for (let i = 10; i >= 0; i--) {
      const timestamp = new Date(now.getTime() - i * 60 * 1000).toISOString();
      const cpuLoad = (Math.random() * 100).toFixed(2); // Simulate random CPU load
      timeseries.push({ time: timestamp, value: cpuLoad });
    }

    res.json(timeseries);
  } catch (err) {
    console.error('Error fetching timeseries data:', err);
    res.status(500).json({ message: 'Server error fetching timeseries data' });
  }
};

exports.getPrediction = (req, res) => {
  const prediction = {
    predictedValue: 60,
    predictedTime: '13:00',
  };
  res.json(prediction);
};