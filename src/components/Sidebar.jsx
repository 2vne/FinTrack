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
      <NavLink to="/dashboard" className="sidebar-brand">
        <span className="brand-icon">FT</span>
        <span>FinTrack</span>
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
      <div className="sidebar-footer">
        <button onClick={handleLogout} className="sidebar-link" style={{ width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.65)' }}>
          <span className="nav-text">{lang.logout}</span>
        </button>
      </div>
    </aside>
  );
}
