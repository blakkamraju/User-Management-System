// App.js
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Register from './components/Register';
import Login from './components/Login';
import Dashboard from './components/Dashboard'; 
import { useAuth } from "./context/AuthContext";

const queryClient = new QueryClient();

function App() {
  const { user } = useAuth();

  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public routes */}
          <Route path="/form/register" element={<Register />} />
          <Route path="/form/login" element={<Login />} />

          {/* Protected route */}
          <Route 
            path="/dashboard" 
            element={user ? <Dashboard /> : <Navigate to="/form/login" replace />} 
          />

          {/* Redirect root to login or dashboard based on auth */}
          <Route 
            path="/" 
            element={<Navigate to={user ? "/dashboard" : "/form/login"} replace />} 
          />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
