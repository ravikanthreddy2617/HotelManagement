import React from 'react';
import { CheckCircle2, AlertCircle, Info, AlertTriangle, X } from 'lucide-react';

const AlertNotification = ({ type = 'info', message, onClose }) => {
  if (!message) return null;

  const getStyle = () => {
    switch (type) {
      case 'success':
        return {
          bg: '#ecfdf5',
          border: '#10b981',
          text: '#065f46',
          icon: <CheckCircle2 size={20} color="#059669" />,
        };
      case 'error':
        return {
          bg: '#fef2f2',
          border: '#ef4444',
          text: '#991b1b',
          icon: <AlertCircle size={20} color="#dc2626" />,
        };
      case 'warning':
        return {
          bg: '#fffbeb',
          border: '#f59e0b',
          text: '#92400e',
          icon: <AlertTriangle size={20} color="#d97706" />,
        };
      default:
        return {
          bg: '#eff6ff',
          border: '#3b82f6',
          text: '#1e40af',
          icon: <Info size={20} color="#2563eb" />,
        };
    }
  };

  const style = getStyle();

  return (
    <div style={{
      backgroundColor: style.bg,
      borderLeft: `4px solid ${style.border}`,
      color: style.text,
      padding: '14px 18px',
      borderRadius: '6px',
      marginBottom: '20px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '12px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.06)',
      fontSize: '0.92rem',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        {style.icon}
        <span>{message}</span>
      </div>
      {onClose && (
        <button onClick={onClose} style={{ color: style.text, padding: '4px', opacity: 0.75 }}>
          <X size={18} />
        </button>
      )}
    </div>
  );
};

export default AlertNotification;
