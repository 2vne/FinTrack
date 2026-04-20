import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useLocation, Link } from 'react-router-dom';
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
  const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
  const userName = currentUser.name || 'U';

  return (
    <div className="app-layout">
      <Sidebar lang={lang} />
      <main className="main-content position-relative">
        <div className="position-absolute" style={{ top: '24px', right: '24px', zIndex: 100 }}>
          <Link to="/settings" className="text-decoration-none">
            <div className="sw-avatar">{userName.charAt(0).toUpperCase()}</div>
          </Link>
        </div>
        {children}
      </main>
    </div>
  );
}

function AppRoutes({ language, setLanguage, lang }) {
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
            <Settings lang={lang} language={language} setLanguage={setLanguage} />
          </AppLayout>
        </ProtectedRoute>
      } />
      <Route path="*" element={<Navigate to="/login" replace />} />
    </Routes>
  );
}

export default function App() {
  const [language, setLanguage] = useState(() => localStorage.getItem('language') || 'en');

  const lang = translations[language] || translations.en;

  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  return (
    <BrowserRouter>
      <AppRoutes language={language} setLanguage={setLanguage} lang={lang} />
    </BrowserRouter>
  );
}
