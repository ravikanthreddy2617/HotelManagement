import React, { useState, useEffect } from 'react';
import { bookingApi, checkInOutApi } from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import AlertNotification from '../components/AlertNotification';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  LogOut, 
  Search, 
  CheckCircle2, 
  Calendar, 
  BedDouble, 
  Receipt,
  UserCheck
} from 'lucide-react';

const CheckOutPage = () => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Selected for Check-Out
  const [selectedBooking, setSelectedBooking] = useState(null);
  const [staffName, setStaffName] = useState(user?.name || 'Front Desk Staff');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    loadCheckedInBookings();
  }, []);

  const loadCheckedInBookings = async () => {
    try {
      setLoading(true);
      setError('');
      // Retrieve bookings currently in CHECKED_IN status
      const res = await bookingApi.getAllBookings('CHECKED_IN');
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      setError(err.message || 'Unable to retrieve in-house guests');
    } finally {
      setLoading(false);
    }
  };

  const handleCheckOutSubmit = async (e) => {
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

      const res = await checkInOutApi.checkOut(payload);
      if (res.success && res.data) {
        setSuccessMsg(`Guest ${selectedBooking.guestName} successfully checked out! Room ${selectedBooking.room.roomNumber} has been updated to AVAILABLE.`);
        setSelectedBooking(null);
        setNotes('');
        loadCheckedInBookings();
      }
    } catch (err) {
      setError(err.message || 'Check-out processing failed');
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
            <LogOut size={16} /> Departure Desk
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: 'var(--navy-900)' }}>
            Guest Departure & Check-Out
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.98rem' }}>
            Complete guest departure, settle room bills, and release suite inventory back to AVAILABLE
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
              placeholder="Search in-house guests by Room #, Guest Name, or Reference"
              className="form-input"
              style={{ flex: 1 }}
            />
          </div>
        </div>

        {loading ? (
          <LoadingSpinner text="Retrieving in-house guests..." />
        ) : bookings.length === 0 ? (
          <div className="luxury-card-light" style={{ textAlign: 'center', padding: '64px 20px' }}>
            <CheckCircle2 size={48} color="#10b981" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.4rem', color: 'var(--navy-900)', marginBottom: '8px' }}>
              No In-House Guests Currently Checked In
            </h3>
            <p style={{ color: '#64748b' }}>
              All hotel guests are either pending arrival or have completed departure.
            </p>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: selectedBooking ? '1.2fr 0.8fr' : '1fr',
            gap: '32px',
            alignItems: 'start',
          }}>
            {/* Table */}
            <div className="luxury-card-light" style={{ padding: '24px', overflowX: 'auto' }}>
              <h2 style={{ fontSize: '1.2rem', color: 'var(--navy-900)', marginBottom: '16px' }}>
                In-House Guests for Departure ({filteredBookings.length})
              </h2>

              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', textTransform: 'uppercase', fontSize: '0.78rem' }}>
                    <th style={{ padding: '12px 14px' }}>Room</th>
                    <th style={{ padding: '12px 14px' }}>Guest Name</th>
                    <th style={{ padding: '12px 14px' }}>Reference</th>
                    <th style={{ padding: '12px 14px' }}>Stay Duration</th>
                    <th style={{ padding: '12px 14px', textAlign: 'right' }}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBookings.map(b => (
                    <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9', background: selectedBooking?.id === b.id ? '#f8fafc' : 'transparent' }}>
                      <td style={{ padding: '14px', fontWeight: '800', color: 'var(--navy-900)' }}>
                        Room {b.room.roomNumber}
                        <span style={{ display: 'block', fontSize: '0.75rem', color: '#64748b', fontWeight: '400' }}>{b.room.roomType}</span>
                      </td>
                      <td style={{ padding: '14px' }}>
                        <div style={{ fontWeight: '600', color: '#1e293b' }}>{b.guestName}</div>
                        <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.guestPhone}</div>
                      </td>
                      <td style={{ padding: '14px', fontFamily: 'monospace' }}>
                        {b.bookingReference}
                      </td>
                      <td style={{ padding: '14px' }}>
                        {b.checkInDate} &rarr; {b.checkOutDate} ({b.totalNights} n)
                      </td>
                      <td style={{ padding: '14px', textAlign: 'right' }}>
                        <button
                          onClick={() => setSelectedBooking(b)}
                          className="btn-danger"
                          style={{ padding: '8px 16px', fontSize: '0.78rem' }}
                        >
                          Check-Out
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Check-Out Execution Panel */}
            {selectedBooking && (
              <div className="luxury-card-light" style={{ padding: '30px' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-900)', marginBottom: '16px', borderBottom: '1px solid #e2e8f0', paddingBottom: '10px' }}>
                  Process Guest Departure
                </h3>

                <div style={{ backgroundColor: '#f8fafc', padding: '16px', borderRadius: '8px', marginBottom: '20px', fontSize: '0.88rem', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <div><strong>Departing Guest:</strong> {selectedBooking.guestName}</div>
                  <div><strong>Vacating Suite:</strong> Room {selectedBooking.room.roomNumber} ({selectedBooking.room.roomType})</div>
                  <div><strong>Booking Ref:</strong> {selectedBooking.bookingReference}</div>
                </div>

                <form onSubmit={handleCheckOutSubmit}>
                  <div className="form-group">
                    <label className="form-label">Front Desk Officer Name</label>
                    <input 
                      type="text"
                      required
                      value={staffName}
                      onChange={(e) => setStaffName(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Departure Notes / Minibar Verification</label>
                    <textarea 
                      rows={3}
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      placeholder="e.g. Minibar verified, keycard returned, guest satisfied"
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
                      className="btn-danger"
                      style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                    >
                      {submitting ? 'Releasing Room...' : 'Complete Check-Out'}
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

export default CheckOutPage;
