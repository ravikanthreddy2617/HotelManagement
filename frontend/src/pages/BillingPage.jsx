import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { billingApi, bookingApi, paymentApi } from '../api/axiosConfig';
import AlertNotification from '../components/AlertNotification';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Crown, 
  Printer, 
  Receipt, 
  CheckCircle2, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar, 
  BedDouble, 
  CreditCard,
  ArrowLeft
} from 'lucide-react';

const BillingPage = () => {
  const { bookingId } = useParams();

  const [bill, setBill] = useState(null);
  const [booking, setBooking] = useState(null);
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // Lookup by ID or Reference if no param
  const [searchInvoice, setSearchInvoice] = useState('');
  const [searching, setSearching] = useState(false);

  useEffect(() => {
    if (bookingId) {
      loadBillData(bookingId);
    } else {
      // Load sample or most recent bill
      setLoading(false);
    }
  }, [bookingId]);

  const loadBillData = async (bId) => {
    try {
      setLoading(true);
      setError('');

      const billRes = await billingApi.getBill(bId);
      if (billRes.success && billRes.data) {
        setBill(billRes.data);
        setBooking(billRes.data.booking);

        try {
          const payRes = await paymentApi.getPaymentByBooking(bId);
          if (payRes.success && payRes.data) {
            setPayment(payRes.data);
          }
        } catch {
          // No payment yet
        }
      }
    } catch (err) {
      setError(err.message || 'Unable to generate bill for this reservation');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchInvoice = async (e) => {
    e.preventDefault();
    if (!searchInvoice.trim()) return;

    try {
      setSearching(true);
      setError('');
      const res = await billingApi.getBillByInvoice(searchInvoice.trim());
      if (res.success && res.data) {
        setBill(res.data);
        setBooking(res.data.booking);
      }
    } catch (err) {
      setError(err.message || 'Invoice not found');
    } finally {
      setSearching(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div style={{ padding: '60px 0 96px', backgroundColor: 'var(--cream-50)', minHeight: '90vh' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Navigation & Toolbar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }} className="no-print">
          <Link to="/my-bookings" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#1e293b', fontWeight: '600' }}>
            <ArrowLeft size={18} /> Back to My Bookings
          </Link>
          {bill && (
            <button onClick={handlePrint} className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <Printer size={18} /> Print Official Invoice
            </button>
          )}
        </div>

        {error && <AlertNotification type="error" message={error} onClose={() => setError('')} />}

        {/* Invoice Search Bar if no bill specified */}
        {!bookingId && !bill && (
          <div className="luxury-card-light" style={{ padding: '32px', marginBottom: '32px' }}>
            <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-900)', marginBottom: '14px' }}>
              Search Hotel Bill by Invoice Number
            </h3>
            <form onSubmit={handleSearchInvoice} style={{ display: 'flex', gap: '12px' }}>
              <input 
                type="text" 
                value={searchInvoice}
                onChange={(e) => setSearchInvoice(e.target.value)}
                placeholder="Enter Invoice Number (e.g. INV-2026-8842)"
                className="form-input"
                style={{ flex: 1 }}
              />
              <button type="submit" disabled={searching} className="btn-gold">
                {searching ? 'Finding...' : 'View Invoice'}
              </button>
            </form>
          </div>
        )}

        {loading ? (
          <LoadingSpinner text="Generating tax invoice statement..." />
        ) : bill ? (
          /* OFFICIAL HOTEL TAX INVOICE */
          <div className="luxury-card-light invoice-container" style={{
            padding: '48px',
            backgroundColor: '#ffffff',
            border: '2px solid rgba(212, 175, 55, 0.3)',
            boxShadow: '0 20px 40px rgba(0,0,0,0.06)',
            borderRadius: '16px',
          }}>
            {/* Invoice Header */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'flex-start',
              borderBottom: '2px solid #0a1526',
              paddingBottom: '28px',
              marginBottom: '32px',
              flexWrap: 'wrap',
              gap: '20px',
            }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <div style={{
                    width: '42px',
                    height: '42px',
                    borderRadius: '50%',
                    background: 'var(--gold-gradient)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                    <Crown size={24} color="#0a1526" strokeWidth={2.2} />
                  </div>
                  <h1 className="font-cinzel" style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--navy-900)', letterSpacing: '0.1em' }}>
                    VELVET CROWN HOTEL
                  </h1>
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b', lineHeight: 1.5 }}>
                  Royal Promenade, Road No. 1, Banjara Hills, Hyderabad, Telangana 500034<br />
                  GSTIN: 36AAACV9842F1Z4 | Contact: +91 40 8945 7700<br />
                  Email: billing@velvetcrown.com
                </div>
              </div>

              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: '0.82rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: '#b38e22', fontWeight: '700' }}>
                  TAX INVOICE / RECEIPT
                </div>
                <div style={{ fontSize: '1.4rem', fontWeight: '800', color: 'var(--navy-900)', fontFamily: 'monospace' }}>
                  {bill.invoiceNumber}
                </div>
                <div style={{ fontSize: '0.85rem', color: '#64748b' }}>
                  Date: {new Date(bill.generatedAt || Date.now()).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })}
                </div>
                <div style={{ marginTop: '8px' }}>
                  <span className={`badge ${bill.status === 'PAID' ? 'badge-success' : 'badge-warning'}`}>
                    Payment: {bill.status}
                  </span>
                </div>
              </div>
            </div>

            {/* Bill To & Stay Summary */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '32px',
              marginBottom: '36px',
            }}>
              <div>
                <h4 style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  Billed To (Guest Details)
                </h4>
                <div style={{ fontSize: '1.15rem', fontWeight: '700', color: 'var(--navy-900)' }}>
                  {booking.guestName}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#475569' }}>
                  Email: {booking.guestEmail}
                </div>
                <div style={{ fontSize: '0.9rem', color: '#475569' }}>
                  Mobile: {booking.guestPhone}
                </div>
              </div>

              <div>
                <h4 style={{ fontSize: '0.85rem', color: '#64748b', textTransform: 'uppercase', marginBottom: '8px', letterSpacing: '0.05em' }}>
                  Reservation Particulars
                </h4>
                <div style={{ fontSize: '0.95rem', color: '#1e293b' }}>
                  Booking Ref: <strong>{booking.bookingReference}</strong>
                </div>
                <div style={{ fontSize: '0.95rem', color: '#1e293b' }}>
                  Room: <strong>Room {booking.room.roomNumber} ({booking.room.roomType})</strong>
                </div>
                <div style={{ fontSize: '0.95rem', color: '#1e293b' }}>
                  Stay: <strong>{booking.checkInDate} to {booking.checkOutDate} ({booking.totalNights} Nights)</strong>
                </div>
              </div>
            </div>

            {/* Itemized Table */}
            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '32px', fontSize: '0.92rem' }}>
              <thead>
                <tr style={{ background: '#f8fafc', borderTop: '2px solid #e2e8f0', borderBottom: '2px solid #e2e8f0' }}>
                  <th style={{ padding: '14px', textAlign: 'left', color: '#475569', textTransform: 'uppercase', fontSize: '0.8rem' }}>Description</th>
                  <th style={{ padding: '14px', textAlign: 'center', color: '#475569', textTransform: 'uppercase', fontSize: '0.8rem' }}>Duration</th>
                  <th style={{ padding: '14px', textAlign: 'right', color: '#475569', textTransform: 'uppercase', fontSize: '0.8rem' }}>Nightly Rate</th>
                  <th style={{ padding: '14px', textAlign: 'right', color: '#475569', textTransform: 'uppercase', fontSize: '0.8rem' }}>Amount</th>
                </tr>
              </thead>
              <tbody>
                <tr style={{ borderBottom: '1px solid #f1f5f9' }}>
                  <td style={{ padding: '16px 14px' }}>
                    <div style={{ fontWeight: '700', color: 'var(--navy-900)' }}>
                      {booking.room.roomType} Accommodation Tariff
                    </div>
                    <div style={{ fontSize: '0.82rem', color: '#64748b' }}>
                      Luxury Suite #{booking.room.roomNumber} with full hospitality privileges
                    </div>
                  </td>
                  <td style={{ padding: '16px 14px', textAlign: 'center' }}>
                    {booking.totalNights} Night(s)
                  </td>
                  <td style={{ padding: '16px 14px', textAlign: 'right' }}>
                    ₹{Number(booking.room.pricePerNight).toLocaleString('en-IN')}
                  </td>
                  <td style={{ padding: '16px 14px', textAlign: 'right', fontWeight: '600' }}>
                    ₹{Number(bill.roomCharges).toLocaleString('en-IN')}
                  </td>
                </tr>
              </tbody>
            </table>

            {/* Calculations Summary */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '40px' }}>
              <div style={{ width: '100%', maxWidth: '360px', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.92rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Room Charges Subtotal:</span>
                  <span style={{ color: '#0f172a', fontWeight: '600' }}>₹{Number(bill.roomCharges).toLocaleString('en-IN')}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', color: '#64748b' }}>
                  <span>Luxury Hotel GST (12%):</span>
                  <span style={{ color: '#0f172a', fontWeight: '600' }}>₹{Number(bill.taxAmount).toLocaleString('en-IN')}</span>
                </div>
                {Number(bill.discountAmount) > 0 && (
                  <div style={{ display: 'flex', justifyContent: 'space-between', color: '#16a34a' }}>
                    <span>Privilege Discount:</span>
                    <span>- ₹{Number(bill.discountAmount).toLocaleString('en-IN')}</span>
                  </div>
                )}
                <div style={{
                  borderTop: '2px solid #0a1526',
                  paddingTop: '12px',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'baseline',
                }}>
                  <span style={{ fontSize: '1.15rem', fontWeight: '800', color: 'var(--navy-900)' }}>Total Amount:</span>
                  <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#b38e22' }}>
                    ₹{Number(bill.totalAmount).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>
            </div>

            {/* Footer Terms */}
            <div style={{
              borderTop: '1px solid #e2e8f0',
              paddingTop: '20px',
              fontSize: '0.8rem',
              color: '#94a3b8',
              lineHeight: 1.6,
            }}>
              <div>1. This invoice is computer-generated for Velvet Crown Hotel and is valid without physical seal.</div>
              <div>2. Standard hotel check-out is 11:00 AM. Late check-out subject to availability.</div>
              <div>3. Thank you for choosing Velvet Crown Hotel. We look forward to welcoming you again.</div>
            </div>
          </div>
        ) : (
          <div className="luxury-card-light" style={{ padding: '60px 20px', textAlign: 'center' }}>
            <Receipt size={48} color="#d4af37" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontSize: '1.3rem', color: 'var(--navy-900)', marginBottom: '8px' }}>
              No Bill Selected
            </h3>
            <p style={{ color: '#64748b', marginBottom: '20px' }}>
              Please select a reservation from My Bookings or enter an invoice number above.
            </p>
            <Link to="/my-bookings" className="btn-gold">
              Go to My Bookings
            </Link>
          </div>
        )}
      </div>
    </div>
  );
};

export default BillingPage;
