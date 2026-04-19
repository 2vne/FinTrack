import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Sidebar from './components/Sidebar';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';
import Expenses from './pages/Expenses';
import Budgets from './pages/Budgets';
import Goals from './pages/Goals';
import Settings from './pages/Settings';
import { translations } from './data/mockData';

function ProtectedRoute({ children }) {
  const currentUser = localStorage.getItem('currentUser');
  if (!currentUser) return <Navigate to="/login" replace />;
  return children;
}

function AppLayout({ children, lang }) {
  return (
    <div className="app-layout">
      <Sidebar lang={lang} />
      <main className="main-content">{children}</main>
    </div>
  );
}

function AppRoutes({ theme, setTheme, language, setLanguage, lang }) {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={
        <ProtectedRoute>
          <AppLayout lang={lang}><Dashboard lang={lang} /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/expenses" element={
        <ProtectedRoute>
          <AppLayout lang={lang}><Expenses lang={lang} /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/budgets" element={
        <ProtectedRoute>
          <AppLayout lang={lang}><Budgets lang={lang} /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/goals" element={
        <ProtectedRoute>
          <AppLayout lang={lang}><Goals lang={lang} /></AppLayout>
        </ProtectedRoute>
      } />
      <Route path="/settings" element={
        <ProtectedRoute>
          <AppLayout lang={lang}>
            <Settings lang={lang} theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  const [theme, setTheme] = useState(() => localStorage.getItem('theme') || 'light');
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  const lang = translations[language] || translations.en;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <BrowserRouter>
      <AppRoutes theme={theme} setTheme={setTheme} language={language} setLanguage={setLanguage} lang={lang} />
    </BrowserRouter>
  );
}
