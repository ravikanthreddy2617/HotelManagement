import React from 'react';
import { Link } from 'react-router-dom';
import { Users, BedDouble, Check, Sparkles, Eye, ArrowRight } from 'lucide-react';

const RoomCard = ({ room, onSelectDetails }) => {
  const isAvailable = room.status === 'AVAILABLE';

  const getCategoryColor = (type) => {
    switch (type?.toUpperCase()) {
      case 'LUXURY':
        return { bg: 'rgba(212, 175, 55, 0.2)', border: '#d4af37', text: '#926f12' };
      case 'DELUXE':
        return { bg: 'rgba(59, 130, 246, 0.15)', border: '#3b82f6', text: '#1d4ed8' };
      default:
        return { bg: 'rgba(16, 185, 129, 0.15)', border: '#10b981', text: '#047857' };
    }
  };

  const catStyle = getCategoryColor(room.roomType);
  const amenitiesList = room.amenities 
    ? room.amenities.split(',').map(a => a.trim()).slice(0, 3) 
    : ['High-speed Wi-Fi', 'Smart TV', 'Luxury Linens'];

  return (
    <div className="luxury-card-light" style={{
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
    }}>
      {/* Room Image Container */}
      <div style={{ position: 'relative', height: '230px', overflow: 'hidden' }}>
        <img 
          src={room.imageUrl || 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80'} 
          alt={`${room.roomType} ${room.roomNumber}`}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            transition: 'transform 0.5s ease',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.06)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
        />
        <div style={{
          position: 'absolute',
          top: '14px',
          left: '14px',
          display: 'flex',
          gap: '8px',
        }}>
          <span style={{
            background: 'rgba(10, 21, 38, 0.85)',
            backdropFilter: 'blur(8px)',
            color: '#f4dc8f',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '0.78rem',
            fontWeight: '700',
            letterSpacing: '0.05em'
          }}>
            ROOM {room.roomNumber}
          </span>
          <span style={{
            background: catStyle.bg,
            border: `1px solid ${catStyle.border}`,
            color: catStyle.text,
            padding: '4px 10px',
            borderRadius: '4px',
            fontSize: '0.78rem',
            fontWeight: '700',
            textTransform: 'uppercase'
          }}>
            {room.roomType}
          </span>
        </div>

        {/* Availability Badge */}
        <div style={{
          position: 'absolute',
          bottom: '14px',
          right: '14px',
        }}>
          <span className={`badge ${isAvailable ? 'badge-success' : 'badge-danger'}`} style={{ backdropFilter: 'blur(6px)', background: isAvailable ? 'rgba(16, 185, 129, 0.9)' : 'rgba(239, 68, 68, 0.9)', color: '#fff' }}>
            {room.status}
          </span>
        </div>
      </div>

      {/* Room Details Content */}
      <div style={{ padding: '22px', display: 'flex', flexDirection: 'column', flex: 1 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '10px' }}>
          <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-900)' }}>
            {room.roomType === 'LUXURY' ? 'Royal Luxury Suite' : room.roomType === 'DELUXE' ? 'Grand Deluxe Room' : 'Classic Standard Room'}
          </h3>
        </div>

        <p style={{
          fontSize: '0.88rem',
          color: 'var(--text-muted)',
          lineHeight: 1.5,
          marginBottom: '16px',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden'
        }}>
          {room.description || 'Immaculately curated room with royal touches, ergonomic workspace, and majestic ambient illumination.'}
        </p>

        {/* Specs & Capacity */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '16px',
          paddingBottom: '14px',
          marginBottom: '14px',
          borderBottom: '1px solid #f1f5f9',
          fontSize: '0.85rem',
          color: '#475569'
        }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <Users size={16} color="#d4af37" />
            Up to {room.capacity || 2} Guests
          </span>
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            <BedDouble size={16} color="#d4af37" />
            King / Queen Bed
          </span>
        </div>

        {/* Amenities Chips */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '20px' }}>
          {amenitiesList.map((amenity, i) => (
            <span key={i} style={{
              background: '#f8fafc',
              border: '1px solid #e2e8f0',
              padding: '3px 8px',
              borderRadius: '4px',
              fontSize: '0.75rem',
              color: '#475569',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Check size={12} color="#10b981" />
              {amenity}
            </span>
          ))}
        </div>

        {/* Price & Action CTA */}
        <div style={{
          marginTop: 'auto',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingTop: '16px',
          borderTop: '1px solid #f1f5f9'
        }}>
          <div>
            <span style={{ fontSize: '0.78rem', color: '#64748b', display: 'block', textTransform: 'uppercase' }}>
              Nightly Rate
            </span>
            <span style={{ fontSize: '1.45rem', fontWeight: '800', color: 'var(--navy-900)' }}>
              ₹{Number(room.pricePerNight).toLocaleString('en-IN')}
            </span>
          </div>

          <div style={{ display: 'flex', gap: '8px' }}>
            {onSelectDetails && (
              <button 
                onClick={() => onSelectDetails(room)}
                title="View Room Details"
                style={{
                  padding: '9px 12px',
                  borderRadius: '6px',
                  background: '#f1f5f9',
                  color: '#1e293b',
                  display: 'flex',
                  alignItems: 'center',
                  transition: 'background 0.2s',
                }}
              >
                <Eye size={17} />
              </button>
            )}

            {isAvailable ? (
              <Link 
                to={`/book?roomId=${room.id}`}
                className="btn-gold" 
                style={{ padding: '9px 18px', fontSize: '0.8rem' }}
              >
                Reserve
                <ArrowRight size={14} />
              </Link>
            ) : (
              <button 
                disabled
                style={{
                  padding: '9px 18px',
                  borderRadius: '6px',
                  background: '#e2e8f0',
                  color: '#94a3b8',
                  fontSize: '0.8rem',
                  fontWeight: '600',
                  cursor: 'not-allowed'
                }}
              >
                Occupied
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default RoomCard;
