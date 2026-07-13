import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldAlert, UserPlus } from 'lucide-react';
import api from '../utils/api';

const Register: React.FC = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('owner');
  const [walletAddress, setWalletAddress] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      setError('Please provide email and password.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      await api.post('/auth/register', {
        email,
        password,
        role,
        wallet_address: walletAddress || null
      });

      alert('Registration successful! Please log in with your credentials.');
      navigate('/login');
    } catch (err: any) {
      console.error(err);
      setError(err.response?.data?.detail || 'Registration failed. Try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ maxWidth: '420px', margin: '40px auto' }} className="glass-card">
      <div style={{ textAlign: 'center', marginBottom: '25px' }}>
        <h2 style={{ fontSize: '24px', fontWeight: 800 }}>Create Account</h2>
        <p style={{ fontSize: '13px', color: 'var(--text-secondary)' }}>Sign up to register sites or verify satellite data.</p>
      </div>

      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Email Address</label>
          <input
            type="email"
            className="form-input"
            placeholder="e.g. project-owner@wetlands.org"
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

        <div className="form-group">
          <label className="form-label">Registry Role</label>
          <select
            className="form-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            disabled={loading}
          >
            <option value="owner">Landowner / Project Developer</option>
            <option value="verifier">Independent Verifier / Scientist</option>
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Web3 Wallet Address (Optional)</label>
          <input
            type="text"
            className="form-input"
            placeholder="e.g. 0x70997970C51812dc3A010C7d01b50e0d17dc79C8"
            value={walletAddress}
            onChange={(e) => setWalletAddress(e.target.value)}
            disabled={loading}
          />
          <span style={{ fontSize: '11px', color: 'var(--text-muted)', marginTop: '4px', display: 'block' }}>
            Linking a wallet enables on-chain credit minting and marketplace trading.
          </span>
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
          <UserPlus size={16} />
          <span>{loading ? 'Creating account...' : 'Create Account'}</span>
        </button>
      </form>

      <div style={{ marginTop: '20px', textAlign: 'center', fontSize: '13px', color: 'var(--text-secondary)' }}>
        Already have an account? <Link to="/login" style={{ color: 'var(--primary-cyan)', textDecoration: 'none' }}>Login here &rarr;</Link>
      </div>
    </div>
  );
};

export default Register;
