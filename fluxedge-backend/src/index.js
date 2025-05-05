require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const http = require('http');
const { Server } = require('socket.io');

const authRoutes = require('./routes/auth');
const metricsRoutes = require('./routes/metrics');
const logsRoutes = require('./routes/logs');
const alertsRoutes = require('./routes/alerts');
const serversRoutes = require('./routes/servers');
const reportsRoutes = require('./routes/reports');
const settingsRoutes = require('./routes/settings');
const { initSocket } = require('./socket');

const PORT = process.env.PORT || 4000;
const app = express();

// Middlewares
app.use(cors({ origin: '*' })); // Ensure CORS is enabled
app.use(express.json());
app.use(morgan('dev'));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/metrics', metricsRoutes);
app.use('/api/logs', logsRoutes);
app.use('/api/alerts', alertsRoutes);
app.use('/api/servers', serversRoutes);
app.use('/api/reports', reportsRoutes);
app.use('/api/settings', settingsRoutes);

app.get('/', (req, res) => {
  res.send('Hello from FluxEdge API!');
});

// Create server & attach Socket.io
const server = http.createServer(app);
const io = new Server(server, {
  cors: { origin: '*' }
});

// Initialize socket logic
initSocket(io);

server.listen(PORT, () => {
  console.log(`FluxEdge backend running on port ${PORT}`);
});
