import React, { useEffect, useState } from 'react';

export default function Profile() {
  const [user, setUser] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await fetch('http://localhost:4000/api/auth/profile', {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!res.ok) {
          throw new Error('Failed to fetch user profile');
        }
        const data = await res.json();
        setUser(data);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchUserProfile();
  }, []);

  if (error) {
    return <div className="p-6 text-red-500">Error: {error}</div>;
  }

  if (!user) {
    return <div className="p-6">Loading...</div>;
  }

  return (
    <div className="p-6 flex justify-center">
      <div className="bg-white shadow-md rounded-lg p-6 w-full max-w-md">
        <div className="flex items-center justify-center mb-6">
          <img
            src={`https://ui-avatars.com/api/?name=${user.username}&background=random`}
            alt="Profile"
            className="w-24 h-24 rounded-full"
          />
        </div>
        <h1 className="text-2xl font-bold text-center mb-4">{user.username}</h1>
        <div className="text-center mb-6">
          <p className="text-gray-600"><strong>Role:</strong> {user.role}</p>
          <p className="text-gray-600"><strong>Email:</strong> {user.email || 'Not provided'}</p>
          <p className="text-gray-600"><strong>Joined:</strong> {new Date(user.createdAt).toLocaleDateString() || 'N/A'}</p>
        </div>
        <div className="flex justify-center">
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
            Edit Profile
          </button>
        </div>
      </div>
    </div>
  );
}
