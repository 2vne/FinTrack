import { NavLink, useNavigate } from 'react-router-dom';

export default function Sidebar({ lang }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  const links = [
    { to: '/dashboard', label: lang.dashboard },
    { to: '/expenses', label: lang.expenses },
    { to: '/budgets', label: lang.budgets },
    { to: '/goals', label: lang.goals },
    { to: '/settings', label: lang.settings },
  ];

  return (
    <aside className="sidebar">
      <NavLink to="/dashboard" className="sidebar-brand d-flex align-items-center text-decoration-none">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" style={{ marginRight: '10px' }}>
          <path d="M4 4h16l-4 4H8v12H4V4zm4 8h8l-4 4H8v-4z" fill="var(--primary)"/>
        </svg>
        <span style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '0.5px' }}>FinTrack</span>
      </NavLink>
      <nav className="sidebar-nav">
        {links.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="nav-text">{link.label}</span>
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-footer p-3">
        <button
          onClick={handleLogout}
          className="btn btn-outline-danger w-100 d-flex justify-content-center align-items-center gap-2 py-2 fw-semibold"
          style={{ transition: 'all 0.2s', borderRadius: '8px' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
          </svg>
          <span className="nav-text">{lang.logout}</span>
        </button>
      </div>
    </aside>
  );
}
