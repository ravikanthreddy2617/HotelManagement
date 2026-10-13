import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import AlertNotification from '../components/AlertNotification';
import { Crown, User, Mail, Phone, Lock, UserPlus, Shield } from 'lucide-react';

const RegisterPage = () => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('ROLE_GUEST');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }

    setLoading(true);

    try {
      const userInfo = await register({
        name,
        email,
        phone,
        password,
        role,
      });

      if (userInfo.role === 'ROLE_ADMIN') {
        navigate('/admin');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message || 'Registration failed. Please check your details.');
    } finally {
      setLoading(false);
    }
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
        maxWidth: '520px',
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
            Guest Membership
          </h2>
          <p style={{ color: '#64748b', fontSize: '0.88rem' }}>
            Register your profile for swift suite reservations and VIP privileges
          </p>
        </div>

        {error && <AlertNotification type="error" message={error} onClose={() => setError('')} />}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <User size={15} color="#d4af37" /> Full Name
            </label>
            <input 
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="e.g. Vikramaditya Rathore"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Mail size={15} color="#d4af37" /> Email Address
            </label>
            <input 
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="e.g. vikram@example.com"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Phone size={15} color="#d4af37" /> Mobile Contact
            </label>
            <input 
              type="tel"
              required
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              placeholder="+91 98765 43210"
              className="form-input"
            />
          </div>

          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Lock size={15} color="#d4af37" /> Password (min. 6 characters)
            </label>
            <input 
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Create secure password"
              className="form-input"
            />
          </div>

          {/* Account Role Selector */}
          <div className="form-group">
            <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
              <Shield size={15} color="#d4af37" /> Membership Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="form-select"
            >
              <option value="ROLE_GUEST">Guest Member (Book suites, demo payment, invoice)</option>
              <option value="ROLE_ADMIN">Staff / Administrator (Manage rooms, check-in, check-out)</option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="btn-gold"
            style={{ width: '100%', padding: '14px', marginTop: '10px' }}
          >
            {loading ? 'Creating Account...' : (
              <>
                <UserPlus size={18} />
                Complete Registration
              </>
            )}
          </button>
        </form>

        <div style={{ textAlign: 'center', marginTop: '24px', fontSize: '0.88rem', color: '#64748b' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: '#b38e22', fontWeight: '700', textDecoration: 'underline' }}>
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
