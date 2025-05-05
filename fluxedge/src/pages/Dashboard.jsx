import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom'; // Import useNavigate for redirection
import { io } from 'socket.io-client';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

export default function Dashboard() {
  const navigate = useNavigate(); // Initialize navigate for redirection
  const [summary, setSummary] = useState({});
  const [timeseries, setTimeseries] = useState([]);
  const [prediction, setPrediction] = useState(null);
  const [alerts, setAlerts] = useState([]);
  const [logs, setLogs] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Unauthorized');
        }

        const headers = { Authorization: `Bearer ${token}` };

        const [summaryRes, timeseriesRes, predictionRes, alertsRes, logsRes] = await Promise.all([
          fetch('http://localhost:4000/api/metrics/summary', { headers }),
          fetch('http://localhost:4000/api/metrics/timeseries', { headers }),
          fetch('http://localhost:4000/api/metrics/predict', { headers }),
          fetch('http://localhost:4000/api/alerts', { headers }),
          fetch('http://localhost:4000/api/logs', { headers }),
        ]);

        if (summaryRes.status === 401 || timeseriesRes.status === 401 || predictionRes.status === 401 || alertsRes.status === 401 || logsRes.status === 401) {
          throw new Error('Unauthorized');
        }

        setSummary(await summaryRes.json());
        setTimeseries(await timeseriesRes.json());
        setPrediction(await predictionRes.json());
        setAlerts(await alertsRes.json());
        setLogs(await logsRes.json());
      } catch (err) {
        if (err.message === 'Unauthorized') {
          localStorage.removeItem('token'); // Clear invalid token
          navigate('/login'); // Redirect to login page
        } else {
          setError(err.message);
        }
      }
    };

    fetchData();
  }, [navigate]);

  useEffect(() => {
    const socket = io('http://localhost:4000');
    socket.on('updateMetrics', (data) => {
      setSummary((prev) => ({ ...prev, ...data }));
    });
    return () => socket.disconnect();
  }, []);

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <main className="flex-1 overflow-y-auto p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Overview</p>
          <h2 className="text-2xl font-bold mt-1">{summary.cpuUsage || 'N/A'}</h2>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Memory</p>
          <h2 className="text-2xl font-bold mt-1">{summary.memory || 'N/A'}</h2>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Network</p>
          <h2 className="text-2xl font-bold mt-1">{summary.diskIO || 'N/A'}</h2>
        </div>
        <div className="bg-white p-4 rounded shadow">
          <p className="text-sm text-gray-500">Alerts</p>
          <h2 className="text-2xl font-bold mt-1">{summary.errorRate || 'N/A'}</h2>
        </div>
      </div>

      {/* Timeseries Data */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold">CPU Usage Over Time</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={timeseries}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="time" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="value" stroke="#8884d8" />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* Predicted CPU Usage */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold">Predicted CPU Usage</h3>
        {prediction ? (
          <p className="text-4xl font-bold text-blue-500">{prediction.predictedValue}%</p>
        ) : (
          <p className="text-gray-400">No prediction available</p>
        )}
      </div>

      {/* Alerts */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h3 className="text-lg font-semibold">Alerts</h3>
        <ul className="list-disc pl-5">
          {alerts.length ? (
            alerts.map((alert) => <li key={alert.id}>{alert.message}</li>)
          ) : (
            <li className="text-gray-400">No alerts available</li>
          )}
        </ul>
      </div>

      {/* Logs */}
      <div className="bg-white p-4 rounded shadow">
        <h3 className="text-lg font-semibold">Logs</h3>
        <ul className="list-disc pl-5">
          {logs.length ? (
            logs.map((log) => <li key={log.id}>{log.message}</li>)
          ) : (
            <li className="text-gray-400">No logs available</li>
          )}
        </ul>
      </div>
    </main>
  );
}
