import React, { useState, useEffect } from 'react';
import { bookingApi, checkInOutApi } from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import AlertNotification from '../components/AlertNotification';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  DoorOpen, 
  Search, 
  CheckCircle2, 
  UserCheck, 
  Calendar, 
  BedDouble, 
  CreditCard,
  ShieldAlert,
  ArrowRight
} from 'lucide-react';

const CheckInPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Selected for Check-In
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [staffName, setStaffName] = useState(user?.name || 'Front Desk Staff');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadEligibleBookings();
  }, []);

  const loadEligibleBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await bookingApi.getAllBookings();
      if (res.success && res.data) {
        // Filter confirmed bookings ready for check in
        setBookings(res.data);
      }
    } catch (err) {
      setError(err.message || 'Unable to retrieve bookings list');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckInSubmit = async (e) => {
    e.preventDefault();
    if (!selectedBooking) return;

    setError('');
    setSuccessMsg('');
    setSubmitting(true);

    try {
      const payload = {
        bookingId: Number(selectedBooking.id),
        staffName,
        notes,
      };

      const res = await checkInOutApi.checkIn(payload);
      if (res.success && res.data) {
        setSuccessMsg(`Guest ${selectedBooking.guestName} has been successfully checked in to Room ${selectedBooking.room.roomNumber}! Room status updated to OCCUPIED.`);
        setSelectedBooking(null);
        setNotes('');
        loadEligibleBookings();
      }
    } catch (err) {
      setError(err.message || 'Check-in failed');
    } finally {
      setSubmitting(false);
    }
  };

  const filteredBookings = bookings.filter(b => {
    if (!searchTerm.trim()) return true;
    const term = searchTerm.toLowerCase();
    return (
      b.bookingReference.toLowerCase().includes(term) ||
      b.guestName.toLowerCase().includes(term) ||
      b.room.roomNumber.toLowerCase().includes(term) ||
      b.guestPhone.toLowerCase().includes(term)
    );
  });

  return (
    <div style={{ padding: '60px 0 96px', backgroundColor: 'var(--cream-50)', minHeight: '90vh' }}>
      <div className="container">
        {/* Title */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#b38e22', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
            <DoorOpen size={16} /> Front Desk Operations
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: 'var(--navy-900)' }}>
            Guest Arrival Check-In Portal
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.98rem' }}>
            Verify reservation credentials, issue electronic room keys, and mark room as OCCUPIED
          </p>
        </div>

        {error && <AlertNotification type="error" message={error} onClose={() => setError('')} />}
        {successMsg && <AlertNotification type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}

        {/* Search Bar */}
        <div className="luxury-card-light" style={{ padding: '24px 28px', marginBottom: '32px' }}>
          <div style={{ display: 'flex', gap: '14px', alignItems: 'center' }}>
            <Search size={20} color="#64748b" />
            <input 
              type="text" 
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search by Booking Reference (e.g. VC-2026-8842), Guest Name, Room #, or Phone"
              className="form-input"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Retrieving check-in candidate bookings..." />
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: selectedBooking ? '1.2fr 0.8fr' : '1fr',
            gap: '32px',
            alignItems: 'start',
          }}>
            {/* Bookings Table / List */}
            <div className="luxury-card-light" style={{ padding: '24px', overflowX: 'auto' }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--navy-900)', marginBottom: '16px' }}>
                Reservations Overview ({filteredBookings.length})
              </h2>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', textTransform: 'uppercase', fontSize: '0.78rem' }}>
                    <th style={{ padding: '12px 14px' }}>Reference</th>
                    <th style={{ padding: '12px 14px' }}>Guest</th>
                    <th style={{ padding: '12px 14px' }}>Room</th>
                    <th style={{ padding: '12px 14px' }}>Dates</th>
                    <th style={{ padding: '12px 14px' }}>Status</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(b => {
                    const isConfirmed = b.status === 'CONFIRMED';
                    const isCheckedIn = b.status === 'CHECKED_IN';

                    return (
                      <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9', background: selectedBooking?.id === b.id ? '#f8fafc' : 'transparent' }}>
                        <td style={{ padding: '14px', fontWeight: '700', color: 'var(--navy-900)' }}>
                          {b.bookingReference}
                        </td>
                        <td style={{ padding: '14px' }}>
                          <div style={{ fontWeight: '600', color: '#1e293b' }}>{b.guestName}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.guestPhone}</div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span style={{ fontWeight: '600' }}>Room {b.room.roomNumber}</span>
                          <span style={{ fontSize: '0.75rem', display: 'block', color: '#64748b' }}>{b.room.roomType}</span>
                        </td>
                        <td style={{ padding: '14px', whiteSpace: 'nowrap' }}>
                          <div>{b.checkInDate}</div>
                          <div style={{ fontSize: '0.75rem', color: '#64748b' }}>to {b.checkOutDate}</div>
                        </td>
                        <td style={{ padding: '14px' }}>
                          <span className={`badge ${isConfirmed ? 'badge-success' : isCheckedIn ? 'badge-info' : 'badge-danger'}`}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px', textAlign: 'right' }}>
                          {isConfirmed ? (
                            <button
                              onClick={() => setSelectedBooking(b)}
                              className="btn-gold"
                              style={{ padding: '8px 16px', fontSize: '0.78rem' }}
                            >
                              Check-In
                            </button>
                          ) : isCheckedIn ? (
                            <span style={{ fontSize: '0.78rem', color: '#047857', fontWeight: '600' }}>
                              In House
                            </span>
                          ) : (
                            <span style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                              {b.status}
                            </span>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Check-In Execution Panel */}
            {selectedBooking && (
              <div className="luxury-card-light" style={{ padding: '30px' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-900)', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                  Complete Guest Check-In
                </h3>

                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><strong>Reference:</strong> {selectedBooking.bookingReference}</div>
                  <div><strong>Guest Name:</strong> {selectedBooking.guestName}</div>
                  <div><strong>Assigned Suite:</strong> Room {selectedBooking.room.roomNumber} ({selectedBooking.room.roomType})</div>
                  <div><strong>Stay Duration:</strong> {selectedBooking.totalNights} Night(s)</div>
                </div>

                <form onSubmit={handleCheckInSubmit}>
                  <div className="form-group">
                    <label className="form-label">Authorized Staff Name</label>
                    <input 
                      type="text"
                      required
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Check-In Notes / Keycard ID</label>
                    <textarea 
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Keycard #A42 issued, baggage sent to Suite"
                      className="form-textarea"
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px' }}>
                    <button
                      type="button"
                      onClick={() => setSelectedBooking(null)}
                      className="btn-navy"
                      style={{ flex: 1, padding: '12px' }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={submitting}
                      className="btn-gold"
                      style={{ flex: 1, padding: '12px' }}
                    >
                      {submitting ? 'Checking In...' : 'Confirm Check-In'}
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default CheckInPage;
