import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    const users = JSON.parse(localStorage.getItem('users') || '[]');
    const user = users.find((u) => u.email === email);

    if (!user) {
      setError('No account found. Please sign up first.');
      setTimeout(() => navigate('/signup'), 2000);
      return;
    }

    if (user.password !== password) {
      setError('Incorrect password. Please try again.');
      return;
    }

    localStorage.setItem('currentUser', JSON.stringify(user));
    navigate('/dashboard');
  };

  return (
    <div className="auth-split">
      <div className="auth-left">
        <div className="auth-brand d-flex align-items-center gap-2">
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 4h16l-4 4H8v12H4V4zm4 8h8l-4 4H8v-4z" fill="var(--primary)"/>
          </svg>
          <span style={{ fontSize: '1.75rem', fontWeight: 600, color: 'var(--text)', letterSpacing: '0.5px' }}>FinTrack</span>
        </div>
        <h1>Take control of your <span className="highlight">wealth</span>.</h1>
        <p className="desc">
          The ultimate personal finance tracker to budget smartly, track expenses, and hit your financial goals effortlessly.
        </p>
      </div>

      <div className="auth-right">
        <div className="auth-form-card fade-in">
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to your FinTrack account</p>

          {error && (
            <div style={{ background: 'rgba(220,38,38,0.1)', color: 'var(--danger)', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.875rem', fontWeight: 500 }}>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="auth-form-group">
              <label>Email Address</label>
              <input type="email" className="auth-input" placeholder="Enter your email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className="auth-form-group">
              <label>Password</label>
              <input type="password" className="auth-input" placeholder="Enter your password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <button type="submit" className="auth-btn">
              Sign In
            </button>
          </form>

          <div className="auth-links">
            Don't have an account? <Link to="/signup">Create account</Link>
          </div>

          <div className="auth-footer-text">
            By signing in, you agree to our Terms of Service and Privacy Policy.
          </div>
        </div>
      </div>
    </div>
  );
}
