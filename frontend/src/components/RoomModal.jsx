import React from 'react';
import { Link } from 'react-router-dom';
import { X, Check, Users, BedDouble, Shield, Sparkles, ArrowRight, Clock } from 'lucide-react';

const RoomModal = ({ room, onClose }) => {
  if (!room) return null;

  const isAvailable = room.status === 'AVAILABLE';
  const amenitiesList = room.amenities 
    ? room.amenities.split(',').map(a => a.trim()) 
    : ['High-speed Wi-Fi', 'Smart OLED TV', 'Luxury Linens', 'Espresso Maker', 'Rainfall Shower', 'Marble Vanity'];

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(5, 11, 20, 0.75)',
      backdropFilter: 'blur(8px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 2000,
      padding: '20px',
    }} onClick={onClose}>
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '16px',
        maxWidth: '800px',
        width: '100%',
        maxHeight: '90vh',
        overflowY: 'auto',
        boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
        position: 'relative',
        border: '1px solid rgba(212, 175, 55, 0.3)',
      }} onClick={(e) => e.stopPropagation()}>
        {/* Close Button */}
        <button 
          onClick={onClose}
          style={{
            position: 'absolute',
            top: '16px',
            right: '16px',
            background: 'rgba(0,0,0,0.6)',
            color: '#fff',
            borderRadius: '50%',
            width: '36px',
            height: '36px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            transition: 'background 0.2s',
          }}
        >
          <X size={20} />
        </button>

        {/* Modal Hero Banner */}
        <div style={{ height: '320px', position: 'relative', overflow: 'hidden' }}>
          <img 
            src={room.imageUrl || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=1200&q=80'} 
            alt={room.roomNumber}
            style={{ width: '100%', height: '100%', objectFit: 'cover' }}
          />
          <div style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            padding: '24px',
            background: 'linear-gradient(to top, rgba(10,21,38,0.95), transparent)',
            color: '#ffffff',
          }}>
            <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
              <span className="badge badge-gold" style={{ background: '#d4af37', color: '#0a1526' }}>
                ROOM {room.roomNumber}
              </span>
              <span className="badge badge-gold">
                {room.roomType}
              </span>
            </div>
            <h2 style={{ fontSize: '1.8rem', color: '#ffffff' }}>
              {room.roomType === 'LUXURY' ? 'The Velvet Royal Suite' : room.roomType === 'DELUXE' ? 'Grand Deluxe Suite' : 'Classic Standard Room'}
            </h2>
          </div>
        </div>

        {/* Modal Body */}
        <div style={{ padding: '28px' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '24px', background: '#f8fafc', padding: '16px', borderRadius: '8px' }}>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Price per Night</span>
              <div style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--navy-900)' }}>
                ₹{Number(room.pricePerNight).toLocaleString('en-IN')}
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Guest Capacity</span>
              <div style={{ fontSize: '1.1rem', fontWeight: '600', color: '#1e293b', display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Users size={18} color="#d4af37" />
                Up to {room.capacity} Guests
              </div>
            </div>
            <div>
              <span style={{ fontSize: '0.8rem', color: '#64748b', textTransform: 'uppercase' }}>Current Status</span>
              <div>
                <span className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`}>
                  {room.status}
                </span>
              </div>
            </div>
          </div>

          <h4 style={{ fontSize: '1.1rem', marginBottom: '10px', color: 'var(--navy-900)' }}>Room Overview</h4>
          <p style={{ color: '#475569', lineHeight: 1.7, marginBottom: '24px', fontSize: '0.95rem' }}>
            {room.description}
          </p>

          <h4 style={{ fontSize: '1.1rem', marginBottom: '12px', color: 'var(--navy-900)' }}>Included Amenities & Privileges</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '10px', marginBottom: '32px' }}>
            {amenitiesList.map((item, idx) => (
              <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.88rem', color: '#334155' }}>
                <div style={{ width: '20px', height: '20px', borderRadius: '50%', background: '#dcfce7', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Check size={12} color="#16a34a" />
                </div>
                <span>{item}</span>
              </div>
            ))}
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '14px', borderTop: '1px solid #e2e8f0', paddingTop: '20px' }}>
            <button onClick={onClose} className="btn-navy" style={{ padding: '10px 20px', background: '#e2e8f0', color: '#1e293b', border: 'none' }}>
              Close
            </button>
            {isAvailable ? (
              <Link 
                to={`/book?roomId=${room.id}`}
                onClick={onClose}
                className="btn-gold"
                style={{ padding: '10px 28px' }}
              >
                Proceed to Reservation
                <ArrowRight size={16} />
              </Link>
            ) : (
              <button disabled className="btn-navy" style={{ opacity: 0.6, cursor: 'not-allowed' }}>
                Room Currently Unavailable
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomModal;
