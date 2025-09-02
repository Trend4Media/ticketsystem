import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Navbar } from './components/Navbar';
import { HomePage } from './pages/HomePage';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { SupportLoginPage } from './pages/SupportLoginPage';
import { CustomerDashboard } from './pages/CustomerDashboard';
import { SupportDashboard } from './pages/SupportDashboard';
import { CreateTicketPage } from './pages/CreateTicketPage';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <Navbar />
          <main className="container mx-auto px-4 py-8">
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/support/login" element={<SupportLoginPage />} />
              
              <Route path="/dashboard" element={
                <ProtectedRoute requiredType="user">
                  <CustomerDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="/create-ticket" element={
                <ProtectedRoute requiredType="user">
                  <CreateTicketPage />
                </ProtectedRoute>
              } />
              
              <Route path="/support/dashboard" element={
                <ProtectedRoute requiredType="support">
                  <SupportDashboard />
                </ProtectedRoute>
              } />
              
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;