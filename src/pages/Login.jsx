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
        <div className="auth-brand">
          <div className="auth-brand-icon">F</div>
          FinTrack
        </div>
        <h1>Take control of your <span className="highlight">wealth</span>.</h1>
        <p className="desc">
          The ultimate personal finance tracker to budget smartly, track expenses, and hit your financial goals effortlessly.
        </p>
        <div className="feature-pill">Smart budgeting</div>
        <div className="feature-pill">Real-time tracking</div>
        <div className="feature-pill">Goal management</div>
      </div>
      
      <div className="auth-right">
        <div className="auth-form-card fade-in">
          <h2>Welcome Back</h2>
          <p className="subtitle">Sign in to your FinTrack account</p>

          {error && (
            <div style={{ background: 'rgba(239,68,68,0.1)', color: '#ef4444', padding: '12px 16px', borderRadius: '8px', marginBottom: '24px', fontSize: '0.875rem', fontWeight: 500 }}>
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
