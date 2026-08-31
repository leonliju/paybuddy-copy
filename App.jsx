import React from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './components/shared/Toast';

import AppShell from './components/layout/AppShell';
import Login from './pages/Login';
import Overview from './pages/Overview';
import Ingestion from './pages/Ingestion';
import Categorisation from './pages/Categorisation';
import Analytics from './pages/Analytics';
import Forecasting from './pages/Forecasting';
import Anomalies from './pages/Anomalies';
import HealthScore from './pages/HealthScore';
import BudgetsGoals from './pages/BudgetsGoals';
import Assistant from './pages/Assistant';

import PayBuddyLogo from './components/shared/PayBuddyLogo';

function ProtectedRoute({ children }) {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="fixed inset-0 bg-[#08080A] flex flex-col items-center justify-center p-6 select-none overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(255,255,255,0.05)_0%,rgba(8,8,10,0.98)_70%)] pointer-events-none" />
        <div className="relative z-10 flex flex-col items-center justify-center text-center">
          <PayBuddyLogo
            size="hero"
            layout="minimal-loader"
            showTagline={false}
            animated={true}
          />
          <p className="mt-8 text-sm font-sans font-medium tracking-[0.2em] text-zinc-300 lowercase animate-fade-in">
            pay, analyse, predict
          </p>
        </div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
}

export function App() {
  return (
    <AuthProvider>
      <ToastProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />

            {/* Protected Routes wrapped in Shell */}
            <Route
              path="/"
              element={
                <ProtectedRoute>
                  <AppShell />
                </ProtectedRoute>
              }
            >
              <Route index element={<Navigate to="/dashboard" replace />} />
              <Route path="dashboard" element={<Overview />} />
              <Route path="ingestion" element={<Ingestion />} />
              <Route path="categorisation" element={<Categorisation />} />
              <Route path="analytics" element={<Analytics />} />
              <Route path="forecasting" element={<Forecasting />} />
              <Route path="anomalies" element={<Anomalies />} />
              <Route path="health-score" element={<HealthScore />} />
              <Route path="budgets-goals" element={<BudgetsGoals />} />
              <Route path="assistant" element={<Assistant />} />
            </Route>

            {/* Catch-all redirect */}
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </BrowserRouter>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
