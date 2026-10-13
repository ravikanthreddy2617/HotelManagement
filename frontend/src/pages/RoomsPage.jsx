import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { roomApi } from '../api/axiosConfig';
import RoomCard from '../components/RoomCard';
import RoomModal from '../components/RoomModal';
import LoadingSpinner from '../components/LoadingSpinner';
import AlertNotification from '../components/AlertNotification';
import { Crown, Search, Filter, Calendar, Sparkles, RefreshCw } from 'lucide-react';

const RoomsPage = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedRoomModal, setSelectedRoomModal] = useState(null);

  // Filters
  const [activeCategory, setActiveCategory] = useState(searchParams.get('roomType') || 'ALL');
  const [checkIn, setCheckIn] = useState(searchParams.get('checkIn') || '');
  const [checkOut, setCheckOut] = useState(searchParams.get('checkOut') || '');
  const [statusFilter, setStatusFilter] = useState('ALL');

  useEffect(() => {
    fetchRooms();
  }, [searchParams]);

  const fetchRooms = async () => {
    try {
      setLoading(true);
      setError('');
      
      const cIn = searchParams.get('checkIn');
      const cOut = searchParams.get('checkOut');
      const type = searchParams.get('roomType');

      const params = {};
      if (cIn && cOut) {
        params.checkIn = cIn;
        params.checkOut = cOut;
      }
      if (type && type !== 'ALL') {
        params.roomType = type;
      }

      const res = await roomApi.getRooms(params);
      if (res.success && res.data) {
        setRooms(res.data);
      }
    } catch (err) {
      setError(err.message || 'Unable to load room catalogue');
    } finally {
      setLoading(false);
    }
  };

  const handleApplyFilter = (category) => {
    setActiveCategory(category);
    const newParams = new URLSearchParams(searchParams);
    if (category === 'ALL') {
      newParams.delete('roomType');
    } else {
      newParams.set('roomType', category);
    }
    setSearchParams(newParams);
  };

  const handleDateSearch = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (checkIn && checkOut) {
      if (new Date(checkOut) <= new Date(checkIn)) {
        setError('Check-out date must be strictly after check-in date');
        return;
      }
      newParams.set('checkIn', checkIn);
      newParams.set('checkOut', checkOut);
    } else {
      newParams.delete('checkIn');
      newParams.delete('checkOut');
    }
    if (activeCategory !== 'ALL') {
      newParams.set('roomType', activeCategory);
    }
    setSearchParams(newParams);
  };

  const handleResetFilters = () => {
    setActiveCategory('ALL');
    setCheckIn('');
    setCheckOut('');
    setStatusFilter('ALL');
    setSearchParams({});
  };

  const filteredRooms = rooms.filter(room => {
    if (activeCategory !== 'ALL' && room.roomType.toUpperCase() !== activeCategory.toUpperCase()) {
      return false;
    }
    if (statusFilter !== 'ALL' && room.status.toUpperCase() !== statusFilter.toUpperCase()) {
      return false;
    }
    return true;
  });

  return (
    <div style={{ paddingBottom: '96px', backgroundColor: 'var(--cream-50)', minHeight: '90vh' }}>
      {/* Header Banner */}
      <section style={{
        background: 'linear-gradient(to bottom, rgba(5, 11, 20, 0.85), rgba(10, 21, 38, 0.95)), url("https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=1920&q=80")',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        padding: '64px 20px',
        textAlign: 'center',
        marginBottom: '40px',
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#d4af37', fontSize: '0.82rem', letterSpacing: '0.2em', textTransform: 'uppercase', marginBottom: '12px' }}>
            <Crown size={18} /> Velvet Crown Portfolio
          </div>
          <h1 style={{ fontSize: 'clamp(2.2rem, 4vw, 3.2rem)', marginBottom: '16px', color: '#ffffff' }}>
            Royal Rooms & Signature Suites
          </h1>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.6' }}>
            Each accommodation features bespoke handcrafted furnishings, soundproof elegance, and bespoke hospitality.
          </p>
        </div>
      </section>

      <div className="container">
        {/* Error Notification */}
        {error && <AlertNotification type="error" message={error} onClose={() => setError('')} />}

        {/* Date Filter Toolbar */}
        <div className="luxury-card-light" style={{ padding: '24px 28px', marginBottom: '36px' }}>
          <form onSubmit={handleDateSearch} style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px',
            alignItems: 'flex-end',
          }}>
            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} color="#d4af37" /> Check-In Date
              </label>
              <input 
                type="date" 
                value={checkIn}
                min={new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckIn(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <Calendar size={15} color="#d4af37" /> Check-Out Date
              </label>
              <input 
                type="date" 
                value={checkOut}
                min={checkIn || new Date().toISOString().split('T')[0]}
                onChange={(e) => setCheckOut(e.target.value)}
                className="form-input"
              />
            </div>

            <div>
              <label className="form-label">Availability Filter</label>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="form-select"
              >
                <option value="ALL">All Statuses</option>
                <option value="AVAILABLE">Available Only</option>
                <option value="OCCUPIED">Occupied</option>
              </select>
            </div>

            <div style={{ display: 'flex', gap: '10px' }}>
              <button type="submit" className="btn-gold" style={{ flex: 1, height: '48px' }}>
                <Search size={16} /> Filter
              </button>
              <button 
                type="button" 
                onClick={handleResetFilters}
                className="btn-navy" 
                title="Reset All Filters"
                style={{ height: '48px', padding: '0 16px' }}
              >
                <RefreshCw size={16} />
              </button>
            </div>
          </form>
        </div>

        {/* Category Pills Navigation */}
        <div style={{
          display: 'flex',
          gap: '12px',
          overflowX: 'auto',
          paddingBottom: '16px',
          marginBottom: '32px',
        }}>
          {[
            { id: 'ALL', label: 'All Suites', price: '₹2,500 - ₹5,000' },
            { id: 'STANDARD', label: 'Standard Room', price: '₹2,500 / night' },
            { id: 'DELUXE', label: 'Deluxe Room', price: '₹3,500 / night' },
            { id: 'LUXURY', label: 'Luxury Suite', price: '₹5,000 / night' },
          ].map(cat => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => handleApplyFilter(cat.id)}
                style={{
                  background: isActive ? 'var(--navy-900)' : '#ffffff',
                  color: isActive ? '#f4dc8f' : '#1e293b',
                  border: isActive ? '1.5px solid #d4af37' : '1px solid #e2e8f0',
                  padding: '12px 22px',
                  borderRadius: '30px',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  fontWeight: isActive ? '700' : '500',
                  boxShadow: isActive ? '0 4px 14px rgba(212, 175, 55, 0.25)' : 'none',
                  transition: 'all 0.2s',
                  whiteSpace: 'nowrap',
                }}
              >
                <span>{cat.label}</span>
                <span style={{
                  fontSize: '0.75rem',
                  padding: '2px 8px',
                  borderRadius: '12px',
                  background: isActive ? 'rgba(212, 175, 55, 0.2)' : '#f1f5f9',
                  color: isActive ? '#f4dc8f' : '#64748b',
                }}>
                  {cat.price}
                </span>
              </button>
            );
          })}
        </div>

        {/* Room Grid */}
        {loading ? (
          <LoadingSpinner text="Retrieving available suites..." />
        ) : filteredRooms.length === 0 ? (
          <div className="luxury-card-light" style={{ textAlign: 'center', padding: '60px 20px' }}>
            <Crown size={48} color="#d4af37" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.4rem', color: 'var(--navy-900)', marginBottom: '8px' }}>
              No Suites Match Your Selected Criteria
            </h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              Try adjusting your stay dates or changing the category filter to view other available royal accommodations.
            </p>
            <button onClick={handleResetFilters} className="btn-gold">
              Reset Filters & Show All Rooms
            </button>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
            gap: '32px',
          }}>
            {filteredRooms.map(room => (
              <RoomCard 
                key={room.id} 
                room={room} 
                onSelectDetails={(r) => setSelectedRoomModal(r)} 
              />
            ))}
          </div>
        )}
      </div>

      {/* Room Detail Modal */}
      {selectedRoomModal && (
        <RoomModal 
          room={selectedRoomModal} 
          onClose={() => setSelectedRoomModal(null)} 
        />
      )}
    </div>
  );
};

export default RoomsPage;
