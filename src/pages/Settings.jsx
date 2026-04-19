import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

export default function Settings({ lang, language, setLanguage }) {
  const navigate = useNavigate();
  const [user, setUser] = useState({ name: '', email: '', income: '' });
  const [editName, setEditName] = useState('');
  const [editIncome, setEditIncome] = useState('');
  const [saved, setSaved] = useState(false);
  const [openFaq, setOpenFaq] = useState(null);

  const faqs = [
    { q: "How do I change my budget?", a: "You can change your budget by navigating to the Budgets page and updating the limits for each category." },
    { q: "How do I track my goals?", a: "The Goals page allows you to set specific financial targets and will show you how much you need to save per month." },
    { q: "Is my data secure?", a: "Currently, this is a demo application storing data in your local browser storage. Clearing your browser data will clear your FinTrack data." },
    { q: "How do I add a new expense category?", a: "In this version, categories are pre-defined to help you start quickly. Custom categories are coming in a future update." },
    { q: "Can I export my transactions?", a: "Exporting to CSV or PDF is not yet supported, but you can view all your transactions in the Expenses tab." }
  ];

  useEffect(() => {
    const currentUser = JSON.parse(localStorage.getItem('currentUser') || '{}');
    setUser(currentUser);
    setEditName(currentUser.name || '');
    setEditIncome(currentUser.income || 60000);
  }, []);

  const handleProfileUpdate = () => {
    const updatedUser = { ...user, name: editName, income: Number(editIncome) };
    localStorage.setItem('currentUser', JSON.stringify(updatedUser));

    // Update in users array too
    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const updatedUsers = users.map((u) => u.email === user.email ? { ...u, name: editName, income: Number(editIncome) } : u);
    localStorage.setItem('users', JSON.stringify(updatedUsers));

    setUser(updatedUser);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleLogout = () => {
    localStorage.removeItem('currentUser');
    navigate('/login');
  };

  return (
    <div className="fade-in">
      <div className="page-header mb-5">
        <div>
          <h1>{lang.settings}</h1>
          <p className="text-secondary">Manage your account and preferences</p>
        </div>
      </div>

      <div>
        {/* Profile Section */}
        <div className="card settings-section mb-4">
          <h3>{lang.profile}</h3>
          <div className="form-group mt-3">
            <label>{lang.name}</label>
            <input type="text" className="form-control" value={editName} onChange={(e) => setEditName(e.target.value)} />
          </div>
          <div className="form-group">
            <label>Monthly Income (₹)</label>
            <input type="number" className="form-control" value={editIncome} onChange={(e) => setEditIncome(e.target.value)} min="0" />
          </div>
          <div className="form-group">
            <label>{lang.email} (read-only)</label>
            <input type="email" className="form-control opacity-75" value={user.email || ''} disabled />
          </div>
          <button className="btn btn-primary w-100 justify-content-center" onClick={handleProfileUpdate}>Save Profile</button>
          {saved && <span className="text-success small mt-2 d-block text-center">Profile updated successfully!</span>}
        </div>

        {/* FAQs Section */}
        <div className="card settings-section mb-4">
          <h3 className="mb-2">FAQs</h3>
          <div className="d-flex flex-column">
            {faqs.map((faq, index) => (
              <div key={index} className="border-bottom border-secondary-subtle py-3">
                <div
                  className="d-flex justify-content-between align-items-center user-select-none"
                  style={{ cursor: 'pointer' }}
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                >
                  <h4 className="h6 fw-semibold mb-0" style={{ fontSize: '0.95rem' }}>{faq.q}</h4>
                  <span className="fs-5 fw-light">{openFaq === index ? '−' : '+'}</span>
                </div>
                {openFaq === index && (
                  <p className="text-secondary small mt-3 mb-0 fade-in">{faq.a}</p>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Logout */}
        <button
          className="btn btn-outline-danger w-100 d-flex justify-content-center align-items-center gap-2 p-3 fw-bold rounded-3 mt-4"
          onClick={handleLogout}
          style={{ transition: 'all 0.2s' }}
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
            <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0v2z" />
            <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708l3-3z" />
          </svg>
          {lang.logout}
        </button>
      </div>
    </div>
  );
}
