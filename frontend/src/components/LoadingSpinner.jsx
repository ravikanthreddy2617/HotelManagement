import React from 'react';

const LoadingSpinner = ({ text = 'Loading...' }) => {
  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '48px 24px',
      gap: '16px',
    }}>
      <div style={{
        width: '46px',
        height: '46px',
        border: '3px solid rgba(212, 175, 55, 0.2)',
        borderTop: '3px solid #d4af37',
        borderRadius: '50%',
        animation: 'spin 0.8s linear infinite',
      }} />
      <div style={{
        fontSize: '0.92rem',
        fontWeight: '600',
        color: '#64748b',
        letterSpacing: '0.05em',
        textTransform: 'uppercase',
      }}>
        {text}
      </div>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default LoadingSpinner;
