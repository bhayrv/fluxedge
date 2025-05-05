import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Servers from './pages/Servers';
import Network from './pages/Network';
import Alerts from './pages/Alerts';
import Reports from './pages/Reports';
import Settings from './pages/Settings';
import Layout from './components/Layout';

function App() {
  const isAuthenticated = () => {
    const token = localStorage.getItem('token');
    return token && token.trim() !== ''; // Ensure token exists and is not empty
  };

  return (
    <Router future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route
          path="/"
          element={<Navigate to={isAuthenticated() ? '/dashboard' : '/login'} replace />}
        />
        <Route
          path="/dashboard"
          element={isAuthenticated() ? <Layout><Dashboard /></Layout> : <Navigate to="/login" replace />}
        />
        <Route
          path="/profile"
          element={isAuthenticated() ? <Layout><Profile /></Layout> : <Navigate to="/login" replace />}
        />
        <Route
          path="/servers"
          element={isAuthenticated() ? <Layout><Servers /></Layout> : <Navigate to="/login" replace />}
        />
        <Route
          path="/network"
          element={isAuthenticated() ? <Layout><Network /></Layout> : <Navigate to="/login" replace />}
        />
        <Route
          path="/alerts"
          element={isAuthenticated() ? <Layout><Alerts /></Layout> : <Navigate to="/login" replace />}
        />
        <Route
          path="/reports"
          element={isAuthenticated() ? <Layout><Reports /></Layout> : <Navigate to="/login" replace />}
        />
        <Route
          path="/settings"
          element={isAuthenticated() ? <Layout><Settings /></Layout> : <Navigate to="/login" replace />}
        />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}

export default App;
