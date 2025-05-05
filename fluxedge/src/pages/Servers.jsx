import React, { useEffect, useState } from 'react';

export default function Servers() {
  const [servers, setServers] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [currentServer, setCurrentServer] = useState(null); // For editing
  const [newServer, setNewServer] = useState({ name: '', ip: '', status: 'online' }); // For adding

  useEffect(() => {
    const fetchServers = async () => {
      try {
        const token = localStorage.getItem('token');
        if (!token) {
          throw new Error('Unauthorized');
        }

        const res = await fetch('http://localhost:4000/api/servers', {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (!res.ok) {
          throw new Error('Failed to fetch servers');
        }

        const data = await res.json();
        setServers(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServers();
  }, []);

  const handleEdit = (server) => {
    setCurrentServer(server);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    try {
      const token = localStorage.getItem('token');
      const res = await fetch(`http://localhost:4000/api/servers/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` },
      });

      if (!res.ok) {
        throw new Error('Failed to delete server');
      }

      setServers(servers.filter((server) => server.id !== id));
    } catch (err) {
      setError(err.message);
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem('token');
      const method = currentServer ? 'PUT' : 'POST';
      const url = currentServer
        ? `http://localhost:4000/api/servers/${currentServer.id}`
        : 'http://localhost:4000/api/servers';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(currentServer || newServer),
      });

      if (!res.ok) {
        throw new Error('Failed to save server');
      }

      const updatedServer = await res.json();
      if (currentServer) {
        setServers(
          servers.map((server) =>
            server.id === updatedServer.id ? updatedServer : server
          )
        );
      } else {
        setServers([...servers, updatedServer]);
      }

      setShowModal(false);
      setCurrentServer(null);
      setNewServer({ name: '', ip: '', status: 'online' });
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
      <h1 className="text-2xl font-bold mb-4">Servers/Devices</h1>
      <p className="mb-6">Manage your servers and devices here.</p>
      <button
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        onClick={() => {
          setCurrentServer(null);
          setShowModal(true);
        }}
      >
        Add Device
      </button>
      <table className="min-w-full bg-white border border-gray-200 rounded shadow">
        <thead>
          <tr>
            <th className="px-4 py-2 border-b">Name</th>
            <th className="px-4 py-2 border-b">IP Address</th>
            <th className="px-4 py-2 border-b">Status</th>
            <th className="px-4 py-2 border-b">Actions</th>
          </tr>
        </thead>
        <tbody>
          {servers.map((server) => (
            <tr key={server.id}>
              <td className="px-4 py-2 border-b">{server.name}</td>
              <td className="px-4 py-2 border-b">{server.ip}</td>
              <td className="px-4 py-2 border-b">
                <span
                  className={`px-2 py-1 rounded text-white ${
                    server.status === 'online' ? 'bg-green-500' : 'bg-red-500'
                  }`}
                >
                  {server.status}
                </span>
              </td>
              <td className="px-4 py-2 border-b">
                <button
                  className="text-blue-500 hover:underline mr-2"
                  onClick={() => handleEdit(server)}
                >
                  Edit
                </button>
                <button
                  className="text-red-500 hover:underline"
                  onClick={() => handleDelete(server.id)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded shadow-md w-full max-w-md">
            <h2 className="text-xl font-bold mb-4">
              {currentServer ? 'Edit Server/Device' : 'Add Server/Device'}
            </h2>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Name</label>
              <input
                className="border border-gray-300 rounded px-3 py-2 w-full"
                value={currentServer ? currentServer.name : newServer.name}
                onChange={(e) =>
                  currentServer
                    ? setCurrentServer({ ...currentServer, name: e.target.value })
                    : setNewServer({ ...newServer, name: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">IP Address</label>
              <input
                className="border border-gray-300 rounded px-3 py-2 w-full"
                value={currentServer ? currentServer.ip : newServer.ip}
                onChange={(e) =>
                  currentServer
                    ? setCurrentServer({ ...currentServer, ip: e.target.value })
                    : setNewServer({ ...newServer, ip: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block mb-1 text-gray-700">Status</label>
              <select
                className="border border-gray-300 rounded px-3 py-2 w-full"
                value={currentServer ? currentServer.status : newServer.status}
                onChange={(e) =>
                  currentServer
                    ? setCurrentServer({ ...currentServer, status: e.target.value })
                    : setNewServer({ ...newServer, status: e.target.value })
                }
              >
                <option value="online">Online</option>
                <option value="offline">Offline</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                className="bg-gray-300 text-gray-700 px-4 py-2 rounded mr-2"
                onClick={() => setShowModal(false)}
              >
                Cancel
              </button>
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                onClick={handleSave}
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
