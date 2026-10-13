import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { bookingApi } from '../api/axiosConfig';
import { useAuth } from '../context/AuthContext';
import AlertNotification from '../components/AlertNotification';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Crown, 
  Calendar, 
  CreditCard, 
  Receipt, 
  XCircle, 
  Search, 
  CheckCircle2, 
  Clock, 
  AlertTriangle,
  DoorOpen,
  BedDouble
} from 'lucide-react';

const MyBookingsPage = () => {
  const { user, isAuthenticated } = useAuth();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Manual Reference Search State
  const [searchRef, setSearchRef] = useState('');
  const [searchLoading, setSearchLoading] = useState(false);

  // Cancellation Modal State
  const [cancellingBooking, setCancellingBooking] = useState(null);
  const [cancelLoading, setCancelLoading] = useState(false);

  useEffect(() => {
    if (isAuthenticated && user) {
      loadUserBookings();
    } else {
      // For demonstration, fetch guest@velvetcrown.com bookings by default or all bookings
      loadDemoGuestBookings();
    }
  }, [user, isAuthenticated]);

  const loadUserBookings = async () => {
    try {
      setLoading(true);
      setError('');
      const res = await bookingApi.getBookingsByEmail(user.email);
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch (err) {
      setError(err.message || 'Unable to load reservations');
    } finally {
      setLoading(false);
    }
  };

  const loadDemoGuestBookings = async () => {
    try {
      setLoading(true);
      // Fetch bookings for demo guest
      const res = await bookingApi.getBookingsByEmail('guest@velvetcrown.com');
      if (res.success && res.data) {
        setBookings(res.data);
      }
    } catch {
      // If error, ignore
    } finally {
      setLoading(false);
    }
  };

  const handleSearchReference = async (e) => {
    e.preventDefault();
    if (!searchRef.trim()) return;

    try {
      setSearchLoading(true);
      setError('');
      const res = await bookingApi.getBookingByRef(searchRef.trim());
      if (res.success && res.data) {
        setBookings([res.data]);
        setSuccessMsg(`Reservation found for reference: ${res.data.bookingReference}`);
      }
    } catch (err) {
      setError(err.message || 'No booking found with this reference');
    } finally {
      setSearchLoading(false);
    }
  };

  const handleConfirmCancel = async () => {
    if (!cancellingBooking) return;

    try {
      setCancelLoading(true);
      setError('');
      const res = await bookingApi.cancelBooking(cancellingBooking.id);
      if (res.success && res.data) {
        setSuccessMsg(`Booking ${cancellingBooking.bookingReference} has been successfully cancelled.`);
        // Update local list
        setBookings(prev => prev.map(b => b.id === cancellingBooking.id ? res.data : b));
        setCancellingBooking(null);
      }
    } catch (err) {
      setError(err.message || 'Failed to cancel reservation');
    } finally {
      setCancelLoading(false);
    }
  };

  const getStatusBadge = (status) => {
    switch (status?.toUpperCase()) {
      case 'CONFIRMED':
        return <span className="badge badge-success">Confirmed</span>;
      case 'CHECKED_IN':
        return <span className="badge badge-info">Checked In</span>;
      case 'CHECKED_OUT':
        return <span className="badge" style={{ background: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1' }}>Checked Out</span>;
      case 'CANCELLED':
        return <span className="badge badge-danger">Cancelled</span>;
      default:
        return <span className="badge badge-warning">{status}</span>;
    }
  };

  return (
    <div style={{ padding: '60px 0 96px', backgroundColor: 'var(--cream-50)', minHeight: '90vh' }}>
      <div className="container">
        {/* Title */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 40px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#b38e22', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
            <Crown size={16} /> Guest Reservations
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: 'var(--navy-900)' }}>
            My Hotel Bookings
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.98rem' }}>
            Review your itinerary, download bills, simulate demo payments, or manage your stay
          </p>
        </div>

        {error && <AlertNotification type="error" message={error} onClose={() => setError('')} />}
        {successMsg && <AlertNotification type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}

        {/* Reference Lookup Bar */}
        <div className="luxury-card-light" style={{ padding: '24px 28px', marginBottom: '36px' }}>
          <form onSubmit={handleSearchReference} style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <input 
                type="text"
                value={searchRef}
                onChange={(e) => setSearchRef(e.target.value)}
                placeholder="Find booking by reference (e.g. VC-2026-8842)"
                className="form-input"
              />
            </div>
            <button type="submit" disabled={searchLoading} className="btn-gold" style={{ height: '48px', padding: '0 24px' }}>
              <Search size={16} />
              {searchLoading ? 'Searching...' : 'Lookup Booking'}
            </button>
            {isAuthenticated && (
              <button 
                type="button" 
                onClick={loadUserBookings} 
                className="btn-navy" 
                style={{ height: '48px', padding: '0 20px' }}
              >
                Reload My Bookings
              </button>
            )}
          </form>
        </div>

        {/* Bookings List */}
        {loading ? (
          <LoadingSpinner text="Retrieving reservations..." />
        ) : bookings.length === 0 ? (
          <div className="luxury-card-light" style={{ textAlign: 'center', padding: '64px 20px' }}>
            <BedDouble size={48} color="#d4af37" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.4rem', color: 'var(--navy-900)', marginBottom: '8px' }}>
              No Reservations Found
            </h3>
            <p style={{ color: '#64748b', marginBottom: '24px' }}>
              You do not have any active bookings under this account or reference.
            </p>
            <Link to="/book" className="btn-gold">
              Make a New Reservation
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {bookings.map(booking => {
              const isCancelled = booking.status === 'CANCELLED';
              const isCheckedOut = booking.status === 'CHECKED_OUT';
              const canCancel = !isCancelled && !isCheckedOut;
              const totalWithGst = Math.round(Number(booking.totalPrice) * 1.12);

              return (
                <div key={booking.id} className="luxury-card-light" style={{
                  padding: '28px',
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
                  gap: '24px',
                  alignItems: 'center',
                  opacity: isCancelled ? 0.75 : 1,
                }}>
                  {/* Info Box */}
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '8px' }}>
                      <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--navy-900)' }}>
                        {booking.bookingReference}
                      </span>
                      {getStatusBadge(booking.status)}
                    </div>

                    <div style={{ fontSize: '0.92rem', color: '#1e293b', fontWeight: '600', marginBottom: '4px' }}>
                      Room {booking.room.roomNumber} — {booking.room.roomType}
                    </div>

                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      Guest: <strong>{booking.guestName}</strong> ({booking.guestEmail})
                    </div>
                  </div>

                  {/* Dates & Nights */}
                  <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '16px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.88rem', color: '#334155', marginBottom: '6px' }}>
                      <Calendar size={15} color="#d4af37" />
                      <span>{booking.checkInDate} &rarr; {booking.checkOutDate}</span>
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      Duration: <strong>{booking.totalNights} Night(s)</strong>
                    </div>
                  </div>

                  {/* Pricing */}
                  <div style={{ borderLeft: '1px solid #f1f5f9', paddingLeft: '16px' }}>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', textTransform: 'uppercase' }}>
                      Total Tariff (incl. 12% GST)
                    </div>
                    <div style={{ fontSize: '1.4rem', fontWeight: '800', color: '#b38e22' }}>
                      ₹{totalWithGst.toLocaleString('en-IN')}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', justifyContent: 'center' }}>
                    {!isCancelled && (
                      <Link 
                        to={`/payment/${booking.id}`} 
                        className="btn-gold"
                        style={{ padding: '9px 16px', fontSize: '0.82rem', textAlign: 'center' }}
                      >
                        <CreditCard size={15} />
                        Demo Payment
                      </Link>
                    )}

                    <Link 
                      to={`/billing/${booking.id}`} 
                      className="btn-outline-gold"
                      style={{ padding: '8px 16px', fontSize: '0.82rem', textAlign: 'center' }}
                    >
                      <Receipt size={15} />
                      View Invoice
                    </Link>

                    {canCancel && (
                      <button
                        onClick={() => setCancellingBooking(booking)}
                        style={{
                          color: '#dc2626',
                          fontSize: '0.82rem',
                          fontWeight: '600',
                          padding: '6px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          gap: '6px',
                          background: 'rgba(239, 68, 68, 0.08)',
                          borderRadius: '6px',
                        }}
                      >
                        <XCircle size={15} />
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Cancellation Confirmation Modal */}
        {cancellingBooking && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 11, 20, 0.75)',
            backdropFilter: 'blur(6px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2500,
            padding: '20px',
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '460px',
              width: '100%',
              padding: '32px',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
              textAlign: 'center',
            }}>
              <div style={{
                width: '56px',
                height: '56px',
                borderRadius: '50%',
                background: '#fee2e2',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <AlertTriangle size={32} color="#dc2626" />
              </div>

              <h3 style={{ fontSize: '1.4rem', color: 'var(--navy-900)', marginBottom: '10px' }}>
                Cancel Reservation?
              </h3>
              <p style={{ color: '#64748b', fontSize: '0.92rem', lineHeight: 1.6, marginBottom: '24px' }}>
                Are you sure you want to cancel booking <strong>{cancellingBooking.bookingReference}</strong> for Room {cancellingBooking.room.roomNumber}? This action will release the room for other guests.
              </p>

              <div style={{ display: 'flex', gap: '12px' }}>
                <button
                  type="button"
                  onClick={() => setCancellingBooking(null)}
                  style={{
                    flex: 1,
                    padding: '12px',
                    borderRadius: '8px',
                    background: '#f1f5f9',
                    color: '#334155',
                    fontWeight: '600',
                  }}
                >
                  Keep Booking
                </button>
                <button
                  type="button"
                  disabled={cancelLoading}
                  onClick={handleConfirmCancel}
                  className="btn-danger"
                  style={{ flex: 1, padding: '12px', justifyContent: 'center' }}
                >
                  {cancelLoading ? 'Cancelling...' : 'Confirm Cancellation'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyBookingsPage;
