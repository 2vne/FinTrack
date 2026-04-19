import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Signup() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const exists = users.find((u) => u.email === email);

    if (exists) {
      setError('An account with this email already exists. Please login.');
      return;
    }

    const newUser = { name, email, password };
    users.push(newUser);
    localStorage.setItem('users', JSON.stringify(users));
    localStorage.setItem('currentUser', JSON.stringify(newUser));
    navigate('/dashboard');
  };

  return (
    <div className="auth-split">
      <div className="auth-left">
        <div className="auth-brand">
          <div className="auth-brand-icon">F</div>
          FinTrack
        </div>
        <h1>Start building your <span className="highlight">future</span>.</h1>
        <p className="desc">
          Join FinTrack today to get a clear overview of your finances and make smarter money decisions.
        </p>
        <div className="feature-pill">Secure & Private</div>
        <div className="feature-pill">Actionable Insights</div>
      </div>
      
      <div className="auth-right">
        <div className="auth-form-card fade-in">
          <h2>Create Account</h2>
          <p className="subtitle">Start tracking your finances today</p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.875rem', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label>Full Name</label>
              <input type="text" className="auth-input" placeholder="John Doe" value={name} onChange={(e) => setName(e.target.value)} required />
            </div>
            <div className="auth-form-group">
              <label>Email Address</label>
              <input type="email" className="auth-input" placeholder="john@example.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="auth-form-group">
              <label>Password</label>
              <input type="password" className="auth-input" placeholder="Create a password" value={password} onChange={(e) => setPassword(e.target.value)} required minLength={6} />
            </div>
            <button type="submit" className="auth-btn">
              Create Account
            </button>
          </form>

          <div className="auth-links">
            Already have an account? <Link to="/login">Sign in</Link>
          </div>
          
          <div className="auth-footer-text">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}
