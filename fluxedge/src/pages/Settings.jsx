import React, { useEffect, useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    theme: 'light',
    notifications: true,
    refreshInterval: 30,
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Unauthorized');
        }

        const res = await fetch('http://localhost:4000/api/settings', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch settings');
        }

        const data = await res.json();
        setSettings(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch('http://localhost:4000/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(settings),
      });

      if (!res.ok) {
        throw new Error('Failed to save settings');
      }

      alert('Settings saved successfully!');
    } catch (err) {
      setError(err.message);
    }
  };

  if (loading) {
    return <div className="p-6">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      <p className="mb-6">Manage your dashboard settings below.</p>
      <div className="bg-white shadow-md rounded-lg p-6">
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Theme</label>
          <select
            className="border border-gray-300 rounded px-3 py-2 w-full"
            value={settings.theme}
            onChange={(e) => setSettings({ ...settings, theme: e.target.value })}
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Notifications</label>
          <input
            type="checkbox"
            className="mr-2"
            checked={settings.notifications}
            onChange={(e) => setSettings({ ...settings, notifications: e.target.checked })}
          />
          Enable Notifications
        </div>
        <div className="mb-4">
          <label className="block mb-1 text-gray-700">Refresh Interval (seconds)</label>
          <input
            type="number"
            className="border border-gray-300 rounded px-3 py-2 w-full"
            value={settings.refreshInterval}
            onChange={(e) => setSettings({ ...settings, refreshInterval: parseInt(e.target.value, 10) })}
          />
        </div>
        <div className="flex justify-end">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
            onClick={handleSave}
          >
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}
