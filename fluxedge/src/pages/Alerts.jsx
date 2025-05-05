import React, { useEffect, useState } from 'react';

export default function Alerts() {
  const [alerts, setAlerts] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAlerts = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Unauthorized');
        }

        const res = await fetch('http://localhost:4000/api/alerts', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch alerts');
        }

        const data = await res.json();
        setAlerts(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchAlerts();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Alerts</h1>
      <p className="mb-6">View and manage alerts and notifications below.</p>
      <div className="bg-white shadow-md rounded-lg p-6">
        {alerts.length === 0 ? (
          <p className="text-gray-500">No alerts available.</p>
        ) : (
          <ul className="space-y-4">
            {alerts.map((alert) => (
              <li
                key={alert.id}
                className={`p-4 rounded shadow ${
                  alert.severity === 'high'
                    ? 'bg-red-100 border-l-4 border-red-500'
                    : alert.severity === 'medium'
                    ? 'bg-yellow-100 border-l-4 border-yellow-500'
                    : 'bg-green-100 border-l-4 border-green-500'
                }`}
              >
                <p className="font-bold">{alert.message}</p>
                <p className="text-sm text-gray-600">
                  Severity: {alert.severity.charAt(0).toUpperCase() + alert.severity.slice(1)}
                </p>
                <p className="text-sm text-gray-600">
                  Timestamp: {new Date(alert.timestamp).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
