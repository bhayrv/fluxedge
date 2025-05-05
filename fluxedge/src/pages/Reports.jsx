import React, { useEffect, useState } from 'react';

export default function Reports() {
  const [reports, setReports] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Unauthorized');
        }

        const res = await fetch('http://localhost:4000/api/reports', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch reports');
        }

        const data = await res.json();
        setReports(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reports</h1>
      <p className="mb-6">View detailed server reports below.</p>
      <table className="min-w-full bg-white border border-gray-200 rounded shadow">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Server Name</th>
            <th className="px-4 py-2 border-b">Uptime</th>
            <th className="px-4 py-2 border-b">CPU Usage</th>
            <th className="px-4 py-2 border-b">Memory Usage</th>
            <th className="px-4 py-2 border-b">Generated Time</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((report) => (
            <tr key={report.id}>
              <td className="px-4 py-2 border-b">{report.serverName}</td>
              <td className="px-4 py-2 border-b">{report.uptime}</td>
              <td className="px-4 py-2 border-b">{report.cpuUsage}</td>
              <td className="px-4 py-2 border-b">{report.memoryUsage}</td>
              <td className="px-4 py-2 border-b">{new Date(report.generatedTime).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
