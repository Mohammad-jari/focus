'use client';

import React, { useState, useEffect } from 'react';
import { HashRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import Landing from '@/pages/Landing';
import AuthScreen from '@/components/AuthScreen';
import OnboardingFlow from '@/components/OnboardingFlow';
import NavigationShell from '@/components/NavigationShell';
import { tessaDb } from '@/lib/tessaDb';

// Loading screen component
function LoadingScreen() {
  return (
    <div className="min-h-screen bg-slate-900 flex flex-col items-center justify-center gap-4">
      <div className="w-16 h-16 rounded-2xl bg-tessa-blue border-b-8 border-tessa-blue-dark flex items-center justify-center text-white font-black text-3xl animate-bounce shadow-xl shadow-tessa-blue/30">
        T
      </div>
      <div className="text-slate-400 font-black text-xs uppercase tracking-widest animate-pulse">
        TESSA Focus Loading...
      </div>
    </div>
  );
}

// Protected Layout Route for authenticated users (Dashboard / Onboarding)
function ProtectedLayout() {
  const [view, setView] = useState<'loading' | 'onboarding' | 'app'>('loading');
  const navigate = useNavigate();

  useEffect(() => {
    const session = tessaDb.auth.getSession();
    if (!session) {
      navigate('/login');
    } else if (!tessaDb.auth.hasProfile()) {
      setView('onboarding');
    } else {
      setView('app');
    }
  }, [navigate]);

  const handleOnboardingComplete = () => {
    setView('app');
  };

  const handleLogout = () => {
    tessaDb.auth.signOut();
    navigate('/login');
  };

  if (view === 'loading') {
    return <LoadingScreen />;
  }

  if (view === 'onboarding') {
    return <OnboardingFlow onComplete={handleOnboardingComplete} />;
  }

  return <NavigationShell onLogout={handleLogout} />;
}

// Login Page Wrapper (Redirects to dashboard if already authenticated)
function LoginPage() {
  const navigate = useNavigate();

  useEffect(() => {
    const session = tessaDb.auth.getSession();
    if (session) {
      navigate('/app');
    }
  }, [navigate]);

  const handleLoginSuccess = () => navigate('/app');
  const handleSignupSuccess = () => navigate('/app');

  return (
    <AuthScreen
      onLoginSuccess={handleLoginSuccess}
      onSignupSuccess={handleSignupSuccess}
    />
  );
}

export default function App() {
  useEffect(() => {
    tessaDb.init();
  }, []);

  return (
    <Router>
      <Routes>
        {/* Landing Page as default root */}
        <Route path="/" element={<Landing />} />
        
        {/* Login Page */}
        <Route path="/login" element={<LoginPage />} />
        
        {/* Protected Application Area (Dashboard & Onboarding) */}
        <Route path="/app" element={<ProtectedLayout />} />
        
        {/* Wildcard redirect to Landing Page */}
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </Router>
  );
}
