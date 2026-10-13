import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertNotification from '../components/AlertNotification';
import { Crown, Mail, Lock, LogIn, UserCheck, ShieldCheck, ArrowRight } from 'lucide-react';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const redirectPath = location.state?.from?.pathname || '/';

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const userInfo = await login(email, password);
      if (userInfo.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate(redirectPath);
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please verify credentials.');
    } finally {
      setLoading(false);
    }
  };

  const fillDemoCredentials = (demoEmail, demoPassword) => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setError('');
  };

  return (
    <div style={{
      minHeight: '85vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 20px',
      backgroundColor: 'var(--cream-50)',
      backgroundImage: 'radial-gradient(rgba(212, 175, 55, 0.08) 1px, transparent 0)',
      backgroundSize: '24px 24px',
    }}>
      <div style={{
        maxWidth: '480px',
        width: '100%',
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        boxShadow: '0 15px 35px rgba(5, 11, 20, 0.08)',
        padding: '40px 32px',
      }}>
        {/* Crest */}
        <div style={{ textAlign: 'center', marginBottom: '28px' }}>
          <div style={{
            width: '56px',
            height: '56px',
            borderRadius: '50%',
            background: 'var(--gold-gradient)',
            margin: '0 auto 12px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(212, 175, 55, 0.35)'
          }}>
            <Crown size={28} color="#0a1526" strokeWidth={2.2} />
          </div>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--navy-900)', marginBottom: '6px' }}>
            Guest Portal Access
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Sign in to manage your luxury reservations and billing receipts
          </p>
        </div>

        {error && <AlertNotification type="error" message={error} onClose={() => setError('')} />}

        {/* Demo Quick-Fill Buttons for College Demonstration */}
        <div style={{
          backgroundColor: '#f8fafc',
          border: '1px dashed #cbd5e1',
          borderRadius: '8px',
          padding: '14px',
          marginBottom: '24px',
        }}>
          <div style={{ fontSize: '0.75rem', fontWeight: '700', textTransform: 'uppercase', color: '#64748b', marginBottom: '8px', letterSpacing: '0.05em' }}>
            ⚡ College Project Demo Quick-Fill
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <button
              type="button"
              onClick={() => fillDemoCredentials('guest@velvetcrown.com', 'guest123')}
              style={{
                padding: '8px',
                borderRadius: '6px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                fontSize: '0.78rem',
                fontWeight: '600',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <UserCheck size={14} color="#059669" />
              Demo Guest
            </button>

            <button
              type="button"
              onClick={() => fillDemoCredentials('admin@velvetcrown.com', 'admin123')}
              style={{
                padding: '8px',
                borderRadius: '6px',
                background: '#ffffff',
                border: '1px solid #cbd5e1',
                fontSize: '0.78rem',
                fontWeight: '600',
                color: '#1e293b',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '6px',
              }}
            >
              <ShieldCheck size={14} color="#d97706" />
              Hotel Admin
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={15} color="#d4af37" /> Email Address
            </label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. arya@example.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={15} color="#d4af37" /> Password
            </label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter secure password"
              className="form-input"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold"
            style={{ width: '100%', padding: '14px', marginTop: '10px' }}
          >
            {loading ? 'Authenticating...' : (
              <>
                <LogIn size={18} />
                Sign In
              </>
            )}
          </button>
        </form>

        {/* Footer Link to Register */}
        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: '#64748b' }}>
          Don't have an account yet?{' '}
          <Link to="/register" style={{ color: '#b38e22', fontWeight: '700', textDecoration: 'underline' }}>
            Register as a Guest
          </Link>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
