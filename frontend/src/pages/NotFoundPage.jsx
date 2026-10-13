import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, Compass, Home, BedDouble } from 'lucide-react';

const NotFoundPage = () => {
  return (
    <div style={{
      minHeight: '80vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 20px',
      backgroundColor: 'var(--cream-50)',
      textAlign: 'center',
    }}>
      <div style={{
        maxWidth: '560px',
        backgroundColor: '#ffffff',
        borderRadius: '20px',
        border: '1px solid rgba(212, 175, 55, 0.3)',
        boxShadow: '0 20px 40px rgba(5, 11, 20, 0.08)',
        padding: '56px 36px',
      }}>
        <div style={{
          width: '72px',
          height: '72px',
          borderRadius: '50%',
          background: 'rgba(212, 175, 55, 0.15)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 20px',
        }}>
          <Compass size={38} color="#b38e22" strokeWidth={1.8} />
        </div>

        <div className="font-cinzel" style={{ fontSize: '3.5rem', fontWeight: '800', color: 'var(--navy-900)', lineHeight: 1 }}>
          404
        </div>

        <h2 style={{ fontSize: '1.6rem', color: 'var(--navy-900)', marginTop: '12px', marginBottom: '12px' }}>
          Lost in the Royal Palace?
        </h2>

        <p style={{ color: '#64748b', fontSize: '0.95rem', lineHeight: 1.6, marginBottom: '32px' }}>
          The private wing or salon you are seeking does not exist or has been relocated within the estate. Let us guide you back to the Grand Foyer.
        </p>

        <div style={{ display: 'flex', gap: '14px', justifyContent: 'center', flexWrap: 'wrap' }}>
          <Link to="/" className="btn-gold">
            <Home size={18} />
            Return to Grand Foyer
          </Link>
          <Link to="/rooms" className="btn-outline-gold">
            <BedDouble size={18} />
            Explore Suites
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
