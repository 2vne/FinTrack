import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings({ lang, theme, setTheme, language, setLanguage }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '' });
  const [editName, setEditName] = useState('');
  const [notifications, setNotifications] = useState(true);
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setUser(currentUser);
    setEditName(currentUser.name || '');
  }, []);

  const handleNameUpdate = () => {
    const updatedUser = { ...user, name: editName };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Update in users array too
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u) => u.email === user.email ? { ...u, name: editName } : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setUser(updatedUser);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const languages = [
    { code: 'en', label: 'English' },
    { code: 'hi', label: 'Hindi' },
    { code: 'te', label: 'Telugu' },
    { code: 'ta', label: 'Tamil' },
  ];

  return (
    <div className="fade-in">
      <div className="page-header">
        <div>
          <h1>{lang.settings}</h1>
          <p>Manage your account and preferences</p>
        </div>
      </div>

      <div style={{ maxWidth: '600px' }}>
        {/* Profile Section */}
        <div className="card settings-section" style={{ marginBottom: '24px' }}>
          <h3>{lang.profile}</h3>
          <div className="form-group" style={{ marginTop: '16px' }}>
            <label>{lang.name}</label>
            <div style={{ display: 'flex', gap: '12px' }}>
              <input type="text" className="form-control" value={editName} onChange={(e) => setEditName(e.target.value)} />
              <button className="btn btn-primary btn-sm" onClick={handleNameUpdate}>Save</button>
            </div>
            {saved && <span style={{ color: '#10b981', fontSize: '0.8rem', marginTop: '4px', display: 'block' }}>Name updated successfully!</span>}
          </div>
          <div className="form-group">
            <label>{lang.email} (read-only)</label>
            <input type="email" className="form-control" value={user.email || ''} disabled style={{ opacity: 0.6 }} />
          </div>
        </div>

        {/* Preferences */}
        <div className="card settings-section" style={{ marginBottom: '24px' }}>
          <h3>{lang.preferences}</h3>
          <div className="setting-row">
            <label>Dark Mode</label>
            <label className="toggle-switch">
              <input type="checkbox" checked={theme === 'dark'} onChange={() => setTheme(theme === 'dark' ? 'light' : 'dark')} />
              <span className="toggle-slider"></span>
            </label>
          </div>
          <div className="setting-row">
            <label>Language</label>
            <select className="form-control" style={{ width: 'auto', minWidth: '150px' }} value={language} onChange={(e) => setLanguage(e.target.value)}>
              {languages.map((l) => <option key={l.code} value={l.code}>{l.label}</option>)}
            </select>
          </div>
          <div className="setting-row">
            <label>{lang.notifications}</label>
            <label className="toggle-switch">
              <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} />
              <span className="toggle-slider"></span>
            </label>
          </div>
        </div>

        {/* Logout */}
        <button className="btn btn-danger" onClick={handleLogout} style={{ width: '100%', justifyContent: 'center', padding: '14px' }}>
          {lang.logout}
        </button>
      </div>
    </div>
  );
}
