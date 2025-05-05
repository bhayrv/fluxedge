import React, { useEffect, useState } from 'react';
import { io } from 'socket.io-client';

export default function Network() {
  const [networkStats, setNetworkStats] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const socket = io('http://localhost:4000'); // Connect to the backend WebSocket server

    socket.on('networkStats', (data) => {
      setNetworkStats(data); // Update network stats in real-time
    });

    socket.on('connect_error', () => {
      setError('Failed to connect to the server');
    });

    return () => {
      socket.disconnect(); // Clean up the socket connection on component unmount
    };
  }, []);

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (!networkStats) {
    return <div className="p-6">Loading network stats...</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Network</h1>
      <p className="mb-6">Monitor and manage your network in real-time.</p>
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Real-Time Network Usage</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-gray-100 p-4 rounded shadow">
            <p className="text-sm text-gray-500">Download Speed</p>
            <h2 className="text-2xl font-bold">{networkStats.rx_sec} KB/s</h2>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <p className="text-sm text-gray-500">Upload Speed</p>
            <h2 className="text-2xl font-bold">{networkStats.tx_sec} KB/s</h2>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <p className="text-sm text-gray-500">Total Received</p>
            <h2 className="text-2xl font-bold">{networkStats.rx_total} MB</h2>
          </div>
          <div className="bg-gray-100 p-4 rounded shadow">
            <p className="text-sm text-gray-500">Total Sent</p>
            <h2 className="text-2xl font-bold">{networkStats.tx_total} MB</h2>
          </div>
        </div>
      </div>
    </div>
  );
}
