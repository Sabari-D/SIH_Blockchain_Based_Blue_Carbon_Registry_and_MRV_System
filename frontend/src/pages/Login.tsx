import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, LogIn } from 'lucide-react';
import api from '../utils/api';
import { useGoogleLogin } from '@react-oauth/google';

const Login: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please enter both email and password.');
      return;
    }

    setLoading(true);
    setError('');

    // FastAPI login takes urlencoded OAuth2 form parameters
    const formData = new URLSearchParams();
    formData.append('username', email);
    formData.append('password', password);

    try {
      const res = await api.post('/auth/login', formData, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });

      const token = res.data.access_token;
      localStorage.setItem('token', token);

      // Decode JWT token locally to get email & role
      const payload = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('userEmail', payload.sub);
      localStorage.setItem('userRole', payload.role);

      // Pre-seed mock wallets for convenience if not already stored
      let wallet = '';
      if (payload.role === 'admin') wallet = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
      else if (payload.role === 'verifier') wallet = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
      else if (payload.role === 'owner') wallet = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';
      
      localStorage.setItem('userWallet', wallet);
      localStorage.setItem('walletAddress', wallet);

      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError('Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (tokenResponse: any) => {
    if (!tokenResponse.access_token) return;
    setLoading(true);
    setError('');
    try {
      const res = await api.post('/auth/google', {
        token: tokenResponse.access_token
      });

      const token = res.data.access_token;
      localStorage.setItem('token', token);

      // Decode JWT token locally to get email & role
      const payload = JSON.parse(atob(token.split('.')[1]));
      localStorage.setItem('userEmail', payload.sub);
      localStorage.setItem('userRole', payload.role);

      // Pre-seed mock wallets for convenience
      let wallet = '';
      if (payload.role === 'admin') wallet = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266';
      else if (payload.role === 'verifier') wallet = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8';
      else if (payload.role === 'owner') wallet = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC';
      
      localStorage.setItem('userWallet', wallet);
      localStorage.setItem('walletAddress', wallet);

      navigate('/');
    } catch (err: any) {
      console.error(err);
      setError('Google Sign-In failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = useGoogleLogin({
    onSuccess: handleGoogleSuccess,
    onError: () => setError('Google Sign-In failed.')
  });

  return (
    <div style={{ maxWidth: '420px', margin: '40px auto' }} className="glass-card">
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Account Login</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Log in to view registers and submit data.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            placeholder="e.g. owner@registry.org"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
          />
        </div>

        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            className="form-input"
            placeholder="••••••••"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
          />
        </div>

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.15)',
            border: '1px solid var(--danger-red)',
            color: '#fca5a5',
            padding: '10px',
            borderRadius: '8px',
            fontSize: '13px',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <ShieldAlert size={16} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-cyan"
          style={{ width: '100%', justifyContent: 'center' }}
          disabled={loading}
        >
          <LogIn size={16} />
          <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
        </button>
      </form>

      <div style={{ margin: '20px 0', textAlign: 'center', color: 'var(--text-muted)', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '10px' }}>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border-glass)' }} />
        <span>OR</span>
        <hr style={{ flex: 1, border: 'none', borderTop: '1px solid var(--border-glass)' }} />
      </div>

      <div style={{ display: 'flex', justifyContent: 'center', width: '100%', marginBottom: '10px' }}>
        <button
          type="button"
          onClick={() => loginWithGoogle()}
          className="btn-google-custom"
          disabled={loading}
        >
          <svg className="google-icon" viewBox="0 0 48 48" width="18" height="18">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
            <path fill="#4285F4" d="M46.5 24c0-1.63-.15-3.2-.43-4.72H24v9h12.75c-.55 2.97-2.22 5.5-4.75 7.19l7.4 5.73C43.75 36.88 46.5 31.02 46.5 24z"/>
            <path fill="#FBBC05" d="M10.54 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.98-6.19z"/>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.4-5.73c-2.11 1.4-4.81 2.3-8.49 2.3-6.26 0-11.57-4.22-13.46-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
          </svg>
          <span>Sign In with Google</span>
        </button>
      </div>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
        Don't have an account? <Link to="/register" style={{ color: 'var(--primary-cyan)', textDecoration: 'none' }}>Register here &rarr;</Link>
      </div>
      
      <div style={{ marginTop: '20px', borderTop: '1px solid var(--border-glass)', paddingTop: '15px', fontSize: '11px', color: 'var(--text-muted)' }}>
        <strong>Default Test Accounts (username / password):</strong>
        <ul style={{ listStyleType: 'none', marginTop: '6px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          <li>Landowner: <code>owner@registry.org</code> / <code>ownerpass</code></li>
          <li>Verifier: <code>verifier@registry.org</code> / <code>verifierpass</code></li>
          <li>Registry Admin: <code>admin@registry.org</code> / <code>adminpass</code></li>
        </ul>
      </div>
    </div>
  );
};

export default Login;

