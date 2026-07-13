import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Waves, LogOut, Wallet, User as UserIcon } from 'lucide-react';
import api from '../utils/api';

interface LayoutProps {
  children: React.ReactNode;
}

const Layout: React.FC<LayoutProps> = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState<{ email: string; role: string; wallet_address?: string } | null>(null);
  const [walletAddress, setWalletAddress] = useState<string>('');

  useEffect(() => {
    fetchProfile();
    // Load wallet address from local storage if connected
    const savedWallet = localStorage.getItem('walletAddress');
    if (savedWallet) {
      setWalletAddress(savedWallet);
    }
  }, [location.pathname]);

  const fetchProfile = async () => {
    const token = localStorage.getItem('token');
    if (!token) {
      setUser(null);
      return;
    }
    try {
      // In our simple auth, we decode the role or query a profile
      // Let's decode from local storage for quick access, or set standard values
      const email = localStorage.getItem('userEmail') || 'user@registry.org';
      const role = localStorage.getItem('userRole') || 'owner';
      const address = localStorage.getItem('userWallet') || '';
      setUser({ email, role, wallet_address: address });
    } catch (e) {
      setUser(null);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userEmail');
    localStorage.removeItem('userRole');
    localStorage.removeItem('userWallet');
    localStorage.removeItem('walletAddress');
    setUser(null);
    setWalletAddress('');
    navigate('/login');
  };

  const connectWallet = async () => {
    // 1. Try to connect to Metamask
    if ((window as any).ethereum) {
      try {
        const accounts = await (window as any).ethereum.request({ method: 'eth_requestAccounts' });
        const addr = accounts[0];
        setWalletAddress(addr);
        localStorage.setItem('walletAddress', addr);
        return;
      } catch (err) {
        console.error("Metamask connection rejected", err);
      }
    }

    // 2. Fallback to mock account address based on user role
    let mockAddr = '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266'; // default admin
    if (user) {
      if (user.role === 'verifier') {
        mockAddr = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'; // verifier
      } else if (user.role === 'owner') {
        mockAddr = '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC'; // owner
      }
    }
    setWalletAddress(mockAddr);
    localStorage.setItem('walletAddress', mockAddr);
    alert(`No Web3 browser extension detected. Connected via Mock Provider to standard Hardhat Account: ${mockAddr.slice(0, 6)}...${mockAddr.slice(-4)}`);
  };

  const formatAddress = (addr: string) => {
    if (!addr) return '';
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  return (
    <div className="app-container">
      <header className="navbar">
        <Link to="/" className="nav-logo">
          <Waves size={28} color="#06b6d4" />
          <span>BLUE CARBON</span>
        </Link>
        
        <nav className="nav-links">
          <Link to="/" className={`nav-link ${location.pathname === '/' ? 'active' : ''}`}>Dashboard</Link>
          <Link to="/transparency" className={`nav-link ${location.pathname === '/transparency' ? 'active' : ''}`}>Transparency</Link>
          {user && (
            <>
              {user.role === 'owner' && (
                <Link to="/submit" className={`nav-link ${location.pathname === '/submit' ? 'active' : ''}`}>Register Project</Link>
              )}
              {user.role === 'verifier' && (
                <Link to="/verifier-queue" className={`nav-link ${location.pathname === '/verifier-queue' ? 'active' : ''}`}>Review Queue</Link>
              )}
              <Link to="/marketplace" className={`nav-link ${location.pathname === '/marketplace' ? 'active' : ''}`}>Marketplace</Link>
            </>
          )}
        </nav>

        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          {walletAddress ? (
            <div className="btn btn-outline" style={{ cursor: 'default' }}>
              <Wallet size={16} color="#10b981" />
              <span>{formatAddress(walletAddress)}</span>
            </div>
          ) : (
            <button className="btn btn-cyan" onClick={connectWallet}>
              <Wallet size={16} />
              <span>Connect Wallet</span>
            </button>
          )}

          {user ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '14px', fontWeight: 600 }}>{user.email}</div>
                <div style={{ fontSize: '11px', color: '#10b981', textTransform: 'uppercase', fontWeight: 800 }}>
                  {user.role}
                </div>
              </div>
              <button 
                className="btn btn-outline" 
                onClick={handleLogout}
                style={{ padding: '8px', minWidth: 'auto' }}
                title="Logout"
              >
                <LogOut size={16} />
              </button>
            </div>
          ) : (
            <div style={{ display: 'flex', gap: '10px' }}>
              <Link to="/login" className="btn btn-outline">Login</Link>
              <Link to="/register" className="btn btn-cyan">Register</Link>
            </div>
          )}
        </div>
      </header>
      
      <main className="main-content">
        {children}
      </main>
      
      <footer style={{
        padding: '30px 40px',
        textAlign: 'center',
        borderTop: '1px solid var(--border-glass)',
        fontSize: '13px',
        color: 'var(--text-muted)'
      }}>
        © 2026 Blue Carbon MRV & Registry Ledger. All rights reserved. Open-source scientific transparency.
      </footer>
    </div>
  );
};

export default Layout;
