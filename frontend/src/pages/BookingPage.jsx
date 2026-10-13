import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { roomApi, bookingApi } from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import AlertNotification from '../components/AlertNotification';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Crown, 
  Calendar, 
  User, 
  Mail, 
  Phone, 
  FileText, 
  CheckCircle2, 
  CreditCard, 
  ShieldCheck, 
  BedDouble,
  ArrowRight
} from 'lucide-react';

const BookingPage = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const preselectedRoomId = searchParams.get('roomId');

  const [rooms, setRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(preselectedRoomId || '');
  const [selectedRoom, setSelectedRoom] = useState(null);

  // Form State
  const [checkInDate, setCheckInDate] = useState('');
  const [checkOutDate, setCheckOutDate] = useState('');
  const [guestName, setGuestName] = useState(user?.name || '');
  const [guestEmail, setGuestEmail] = useState(user?.email || '');
  const [guestPhone, setGuestPhone] = useState(user?.phone || '');
  const [specialRequests, setSpecialRequests] = useState('');

  // UI state
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Auto-calculated pricing
  const [totalNights, setTotalNights] = useState(1);
  const [roomTariffTotal, setRoomTariffTotal] = useState(0);
  const [taxAmount, setTaxAmount] = useState(0);
  const [grandTotal, setGrandTotal] = useState(0);

  useEffect(() => {
    // Default dates: tomorrow to +2 days
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 2);

    setCheckInDate(tomorrow.toISOString().split('T')[0]);
    setCheckOutDate(dayAfter.toISOString().split('T')[0]);

    fetchRooms();
  }, []);

  useEffect(() => {
    if (user) {
      if (!guestName) setGuestName(user.name);
      if (!guestEmail) setGuestEmail(user.email);
      if (!guestPhone && user.phone) setGuestPhone(user.phone);
    }
  }, [user]);

  const fetchRooms = async () => {
    try {
      setLoadingRooms(true);
      const res = await roomApi.getRooms();
      if (res.success && res.data) {
        setRooms(res.data);
        if (preselectedRoomId) {
          const match = res.data.find(r => String(r.id) === String(preselectedRoomId));
          if (match) {
            setSelectedRoomId(match.id);
            setSelectedRoom(match);
          }
        } else if (res.data.length > 0) {
          setSelectedRoomId(res.data[0].id);
          setSelectedRoom(res.data[0]);
        }
      }
    } catch (err) {
      setError('Unable to load rooms list');
    } finally {
      setLoadingRooms(false);
    }
  };

  useEffect(() => {
    if (selectedRoomId && rooms.length > 0) {
      const found = rooms.find(r => String(r.id) === String(selectedRoomId));
      setSelectedRoom(found || null);
    }
  }, [selectedRoomId, rooms]);

  // Recalculate duration & pricing whenever dates or room changes
  useEffect(() => {
    if (checkInDate && checkOutDate && selectedRoom) {
      const start = new Date(checkInDate);
      const end = new Date(checkOutDate);
      const diffTime = end.getTime() - start.getTime();
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays > 0) {
        setTotalNights(diffDays);
        const tariff = Number(selectedRoom.pricePerNight) * diffDays;
        const tax = Math.round(tariff * 0.12); // 12% GST
        setRoomTariffTotal(tariff);
        setTaxAmount(tax);
        setGrandTotal(tariff + tax);
      } else {
        setTotalNights(0);
        setRoomTariffTotal(0);
        setTaxAmount(0);
        setGrandTotal(0);
      }
    }
  }, [checkInDate, checkOutDate, selectedRoom]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');

    if (!selectedRoom) {
      setError('Please select a suite to book');
      return;
    }

    if (new Date(checkOutDate) <= new Date(checkInDate)) {
      setError('Check-out date must be strictly after check-in date');
      return;
    }

    if (totalNights < 1) {
      setError('Minimum stay duration is 1 night');
      return;
    }

    setSubmitting(true);

    try {
      const payload = {
        roomId: Number(selectedRoom.id),
        userId: user ? user.id : null,
        guestName,
        guestEmail,
        guestPhone,
        checkInDate,
        checkOutDate,
        specialRequests,
      };

      const res = await bookingApi.createBooking(payload);
      if (res.success && res.data) {
        const booking = res.data;
        setSuccessMsg(`Reservation Created! Booking Reference: ${booking.bookingReference}. Redirecting to Demo Payment...`);
        // Navigate to payment page
        setTimeout(() => {
          navigate(`/payment/${booking.id}`);
        }, 1200);
      }
    } catch (err) {
      // Backend error message: e.g. room already booked for overlapping dates
      setError(err.message || 'Booking reservation could not be completed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ padding: '60px 0 96px', backgroundColor: 'var(--cream-50)', minHeight: '90vh' }}>
      <div className="container">
        {/* Page Title */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#b38e22', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
            <Crown size={16} /> Velvet Crown Reservations
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: 'var(--navy-900)' }}>
            Reserve Your Royal Suite
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.98rem' }}>
            Guaranteed best tariffs, complimentary cancellation, and instant confirmation
          </p>
        </div>

        {error && <AlertNotification type="error" message={error} onClose={() => setError('')} />}
        {successMsg && <AlertNotification type="success" message={successMsg} />}

        {loadingRooms ? (
          <LoadingSpinner text="Preparing luxury booking engine..." />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))',
            gap: '36px',
            alignItems: 'start',
          }}>
            {/* Form Column */}
            <div className="luxury-card-light" style={{ padding: '36px 30px' }}>
              <h2 style={{ fontSize: '1.4rem', color: 'var(--navy-900)', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                Guest & Stay Details
              </h2>

              <form onSubmit={handleSubmit}>
                {/* 1. Room Selection */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <BedDouble size={16} color="#d4af37" /> Select Suite / Room
                  </label>
                  <select 
                    value={selectedRoomId}
                    onChange={(e) => setSelectedRoomId(e.target.value)}
                    className="form-select"
                    required
                  >
                    {rooms.map(r => (
                      <option key={r.id} value={r.id}>
                        Room {r.roomNumber} — {r.roomType} (₹{Number(r.pricePerNight).toLocaleString('en-IN')}/night) {r.status !== 'AVAILABLE' ? `[${r.status}]` : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* 2. Stay Dates */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={15} color="#d4af37" /> Check-In Date
                    </label>
                    <input 
                      type="date"
                      required
                      min={new Date().toISOString().split('T')[0]}
                      value={checkInDate}
                      onChange={(e) => setCheckInDate(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Calendar size={15} color="#d4af37" /> Check-Out Date
                    </label>
                    <input 
                      type="date"
                      required
                      min={checkInDate || new Date().toISOString().split('T')[0]}
                      value={checkOutDate}
                      onChange={(e) => setCheckOutDate(e.target.value)}
                      className="form-input"
                    />
                  </div>
                </div>

                {/* 3. Guest Information */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <User size={15} color="#d4af37" /> Guest Full Name
                  </label>
                  <input 
                    type="text"
                    required
                    value={guestName}
                    onChange={(e) => setGuestName(e.target.value)}
                    placeholder="Enter guest full name"
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Mail size={15} color="#d4af37" /> Email Address
                    </label>
                    <input 
                      type="email"
                      required
                      value={guestEmail}
                      onChange={(e) => setGuestEmail(e.target.value)}
                      placeholder="guest@example.com"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <Phone size={15} color="#d4af37" /> Mobile Phone
                    </label>
                    <input 
                      type="tel"
                      required
                      value={guestPhone}
                      onChange={(e) => setGuestPhone(e.target.value)}
                      placeholder="+91 98765 43210"
                      className="form-input"
                    />
                  </div>
                </div>

                {/* 4. Special Requests */}
                <div className="form-group">
                  <label className="form-label" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <FileText size={15} color="#d4af37" /> Special Requests (Optional)
                  </label>
                  <textarea 
                    rows={3}
                    value={specialRequests}
                    onChange={(e) => setSpecialRequests(e.target.value)}
                    placeholder="e.g. Airport chauffeur pickup, extra goose-down pillows, ocean-facing floor"
                    className="form-textarea"
                  />
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="btn-gold"
                  style={{ width: '100%', padding: '16px', fontSize: '0.95rem' }}
                >
                  {submitting ? 'Confirming Reservation with Backend...' : (
                    <>
                      Proceed to Demo Payment
                      <ArrowRight size={18} />
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* Live Pricing Breakdown Card */}
            <div>
              {selectedRoom && (
                <div className="luxury-card-light" style={{ padding: '30px', marginBottom: '24px' }}>
                  <div style={{ position: 'relative', height: '180px', borderRadius: '8px', overflow: 'hidden', marginBottom: '20px' }}>
                    <img 
                      src={selectedRoom.imageUrl} 
                      alt={selectedRoom.roomNumber}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    />
                    <div style={{
                      position: 'absolute',
                      top: '12px',
                      left: '12px',
                      background: 'rgba(10, 21, 38, 0.9)',
                      color: '#f4dc8f',
                      padding: '4px 10px',
                      borderRadius: '4px',
                      fontSize: '0.78rem',
                      fontWeight: '700'
                    }}>
                      ROOM {selectedRoom.roomNumber}
                    </div>
                  </div>

                  <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-900)', marginBottom: '6px' }}>
                    {selectedRoom.roomType === 'LUXURY' ? 'Royal Luxury Suite' : selectedRoom.roomType === 'DELUXE' ? 'Grand Deluxe Room' : 'Classic Standard Room'}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '0.85rem', marginBottom: '18px' }}>
                    {selectedRoom.description}
                  </p>

                  {/* Summary Breakdown */}
                  <div style={{ borderTop: '1px solid #f1f5f9', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                      <span>Stay Duration</span>
                      <strong style={{ color: '#0f172a' }}>{totalNights} Night(s)</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                      <span>Tariff per Night</span>
                      <strong style={{ color: '#0f172a' }}>₹{Number(selectedRoom.pricePerNight).toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                      <span>Base Room Charges ({totalNights} × ₹{Number(selectedRoom.pricePerNight).toLocaleString('en-IN')})</span>
                      <strong style={{ color: '#0f172a' }}>₹{roomTariffTotal.toLocaleString('en-IN')}</strong>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', color: '#475569' }}>
                      <span>Luxury Hotel GST (12%)</span>
                      <strong style={{ color: '#0f172a' }}>₹{taxAmount.toLocaleString('en-IN')}</strong>
                    </div>

                    <div style={{
                      borderTop: '2px solid #e2e8f0',
                      marginTop: '8px',
                      paddingTop: '12px',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'baseline',
                    }}>
                      <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--navy-900)' }}>
                        Grand Total
                      </span>
                      <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#b38e22' }}>
                        ₹{grandTotal.toLocaleString('en-IN')}
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* Trust Badges */}
              <div style={{ background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '12px', padding: '20px' }}>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center', marginBottom: '12px' }}>
                  <ShieldCheck size={24} color="#10b981" />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1e293b' }}>
                      Overlapping Booking Prevention
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      Live MySQL database checks prevent double bookings for conflicting dates.
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <CreditCard size={24} color="#3b82f6" />
                  <div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '700', color: '#1e293b' }}>
                      Demo Payment Simulation
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b' }}>
                      No real charges — supports simulated UPI, Card, and Cash demo receipts.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default BookingPage;
