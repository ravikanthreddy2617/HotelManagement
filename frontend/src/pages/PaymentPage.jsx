import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { bookingApi, paymentApi, billingApi } from '../api/axiosConfig';
import AlertNotification from '../components/AlertNotification';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Crown, 
  CreditCard, 
  QrCode, 
  Banknote, 
  CheckCircle2, 
  AlertCircle, 
  Printer, 
  ArrowRight, 
  ShieldCheck, 
  Receipt,
  Clock,
  Sparkles,
  Smartphone
} from 'lucide-react';

const PaymentPage = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();

  const [booking, setBooking] = useState(null);
  const [existingPayment, setExistingPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState('');
  const [successReceipt, setSuccessReceipt] = useState(null);

  // Payment Form States
  const [paymentMethod, setPaymentMethod] = useState('UPI_DEMO'); // UPI_DEMO, CARD_DEMO, CASH_DEMO
  const [payerDetails, setPayerDetails] = useState('');
  const [simulateFailure, setSimulateFailure] = useState(false);

  // Card Inputs
  const [cardNumber, setCardNumber] = useState('4532 •••• •••• 8892');
  const [cardHolder, setCardHolder] = useState('');
  const [cardExpiry, setCardExpiry] = useState('12/28');
  const [cardCvv, setCardCvv] = useState('789');

  // UPI Inputs
  const [upiId, setUpiId] = useState('guest@oksbi');

  useEffect(() => {
    if (bookingId) {
      loadBookingAndPayment();
    }
  }, [bookingId]);

  const loadBookingAndPayment = async () => {
    try {
      setLoading(true);
      setError('');

      // Fetch booking
      const res = await bookingApi.getBookingById(bookingId);
      if (res.success && res.data) {
        setBooking(res.data);
        setCardHolder(res.data.guestName);

        // Check if already paid
        try {
          const payRes = await paymentApi.getPaymentByBooking(bookingId);
          if (payRes.success && payRes.data) {
            setExistingPayment(payRes.data);
            setSuccessReceipt(payRes.data);
          }
        } catch {
          // No payment yet, proceed to payment form
        }
      }
    } catch (err) {
      setError(err.message || 'Unable to load booking details');
    } finally {
      setLoading(false);
    }
  };

  const handleProcessPayment = async (e) => {
    e.preventDefault();
    setError('');
    setProcessing(true);

    try {
      let details = payerDetails;
      if (paymentMethod === 'UPI_DEMO') {
        details = `UPI: ${upiId} (Demo Simulator)`;
      } else if (paymentMethod === 'CARD_DEMO') {
        details = `Card ending in 8892 (${cardHolder}) - Demo`;
      } else if (paymentMethod === 'CASH_DEMO') {
        details = 'Cash on Check-In at Front Desk (Demo)';
      }

      // Calculate total amount with 12% GST
      const totalAmountWithGst = Math.round(Number(booking.totalPrice) * 1.12);

      const payload = {
        bookingId: Number(booking.id),
        amount: totalAmountWithGst,
        paymentMethod,
        payerDetails: details,
        simulateFailure,
      };

      const res = await paymentApi.processPayment(payload);
      if (res.success && res.data) {
        setSuccessReceipt(res.data);
      }
    } catch (err) {
      setError(err.message || 'Payment simulation failed');
    } finally {
      setProcessing(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return <LoadingSpinner text="Retrieving reservation details..." />;
  }

  if (!booking) {
    return (
      <div className="container" style={{ padding: '60px 0', textAlign: 'center' }}>
        <AlertNotification type="error" message={error || 'Booking reservation not found'} />
        <Link to="/rooms" className="btn-gold">Return to Rooms</Link>
      </div>
    );
  }

  const grandTotal = Math.round(Number(booking.totalPrice) * 1.12);

  return (
    <div style={{ padding: '50px 0 96px', backgroundColor: 'var(--cream-50)', minHeight: '90vh' }}>
      <div className="container" style={{ maxWidth: '960px' }}>
        {/* Academic Demo Disclaimer Banner */}
        <div style={{
          backgroundColor: '#eff6ff',
          border: '1.5px solid #3b82f6',
          borderRadius: '12px',
          padding: '16px 20px',
          marginBottom: '32px',
          display: 'flex',
          alignItems: 'center',
          gap: '14px',
        }}>
          <ShieldCheck size={28} color="#2563eb" style={{ flexShrink: 0 }} />
          <div>
            <div style={{ fontSize: '0.92rem', fontWeight: '800', color: '#1e40af', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Academic Demonstration Payment Gateway
            </div>
            <div style={{ fontSize: '0.85rem', color: '#334155' }}>
              All transactions in this module are strictly simulated for college project evaluation. 
              <strong> No real money is transferred, and no real bank credentials are accessed.</strong>
            </div>
          </div>
        </div>

        {error && <AlertNotification type="error" message={error} onClose={() => setError('')} />}

        {/* IF SUCCESS RECEIPT EXISTS -> DISPLAY OFFICIAL RECEIPT */}
        {successReceipt ? (
          <div className="luxury-card-light" style={{ padding: '40px', maxWidth: '750px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: '32px' }}>
              <div style={{
                width: '64px',
                height: '64px',
                borderRadius: '50%',
                background: '#dcfce7',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 16px',
              }}>
                <CheckCircle2 size={36} color="#16a34a" />
              </div>
              <h2 style={{ fontSize: '1.8rem', color: 'var(--navy-900)', marginBottom: '6px' }}>
                Payment Successfully Recorded!
              </h2>
              <div style={{ color: '#059669', fontWeight: '700', fontSize: '0.9rem', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                Status: {successReceipt.status} (DEMO SIMULATION)
              </div>
            </div>

            {/* Receipt Summary Box */}
            <div style={{
              backgroundColor: '#f8fafc',
              border: '1px solid #e2e8f0',
              borderRadius: '12px',
              padding: '24px',
              marginBottom: '32px',
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Demo Transaction Reference:</span>
                <strong style={{ color: '#0f172a', fontFamily: 'monospace', fontSize: '1rem' }}>
                  {successReceipt.transactionReference}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Booking Reference:</span>
                <strong style={{ color: '#0f172a' }}>{booking.bookingReference}</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Reserved Suite:</span>
                <strong style={{ color: '#0f172a' }}>Room {booking.room.roomNumber} ({booking.room.roomType})</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Stay Dates:</span>
                <strong style={{ color: '#0f172a' }}>{booking.checkInDate} to {booking.checkOutDate} ({booking.totalNights} nights)</strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #e2e8f0', paddingBottom: '14px', marginBottom: '14px' }}>
                <span style={{ fontSize: '0.85rem', color: '#64748b' }}>Demo Payment Mode:</span>
                <span className="badge badge-gold">{successReceipt.paymentMethod}</span>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', paddingTop: '6px' }}>
                <span style={{ fontSize: '1rem', fontWeight: '700', color: 'var(--navy-900)' }}>Total Paid (incl. 12% GST):</span>
                <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#b38e22' }}>
                  ₹{Number(successReceipt.amount).toLocaleString('en-IN')}
                </span>
              </div>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', justifyContent: 'center' }} className="no-print">
              <button onClick={handlePrint} className="btn-navy" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Printer size={18} />
                Print Receipt
              </button>
              <Link to={`/billing/${booking.id}`} className="btn-outline-gold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Receipt size={18} />
                View Detailed Invoice
              </Link>
              <Link to="/my-bookings" className="btn-gold" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                My Bookings &rarr;
              </Link>
            </div>
          </div>
        ) : (
          /* PAYMENT FORM SECTION */
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '32px',
          }}>
            {/* Left: Payment Method Selection */}
            <div className="luxury-card-light" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--navy-900)', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                Select Demo Payment Method
              </h2>

              {/* Payment Method Radio Tabs */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginBottom: '28px' }}>
                {[
                  { id: 'UPI_DEMO', label: 'UPI Demo (Google Pay / PhonePe / QR)', icon: <QrCode size={20} color="#d4af37" /> },
                  { id: 'CARD_DEMO', label: 'Credit / Debit Card Demo', icon: <CreditCard size={20} color="#d4af37" /> },
                  { id: 'CASH_DEMO', label: 'Cash at Front Desk (Demo)', icon: <Banknote size={20} color="#d4af37" /> },
                ].map((mode) => (
                  <label
                    key={mode.id}
                    onClick={() => setPaymentMethod(mode.id)}
                    style={{
                      border: paymentMethod === mode.id ? '2px solid #d4af37' : '1px solid #cbd5e1',
                      borderRadius: '10px',
                      padding: '14px 18px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '14px',
                      cursor: 'pointer',
                      background: paymentMethod === mode.id ? 'rgba(212, 175, 55, 0.08)' : '#ffffff',
                      transition: 'all 0.2s',
                    }}
                  >
                    <input 
                      type="radio" 
                      name="paymentMethod" 
                      checked={paymentMethod === mode.id} 
                      onChange={() => setPaymentMethod(mode.id)}
                      style={{ accentColor: '#d4af37', width: '18px', height: '18px' }}
                    />
                    {mode.icon}
                    <span style={{ fontWeight: '600', fontSize: '0.92rem', color: '#1e293b' }}>
                      {mode.label}
                    </span>
                  </label>
                ))}
              </div>

              {/* Dynamic Inputs Based on Selection */}
              {paymentMethod === 'UPI_DEMO' && (
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', marginBottom: '24px' }}>
                  <div style={{ textAlign: 'center', marginBottom: '16px' }}>
                    <div style={{
                      display: 'inline-block',
                      background: '#ffffff',
                      padding: '16px',
                      borderRadius: '12px',
                      border: '1px solid #cbd5e1',
                      boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
                    }}>
                      {/* Simulated QR Code SVG */}
                      <svg width="140" height="140" viewBox="0 0 100 100" style={{ display: 'block' }}>
                        <rect width="100" height="100" fill="#ffffff"/>
                        <rect x="10" y="10" width="25" height="25" fill="#0a1526"/>
                        <rect x="14" y="14" width="17" height="17" fill="#ffffff"/>
                        <rect x="17" y="17" width="11" height="11" fill="#0a1526"/>
                        
                        <rect x="65" y="10" width="25" height="25" fill="#0a1526"/>
                        <rect x="69" y="14" width="17" height="17" fill="#ffffff"/>
                        <rect x="72" y="17" width="11" height="11" fill="#0a1526"/>
                        
                        <rect x="10" y="65" width="25" height="25" fill="#0a1526"/>
                        <rect x="14" y="69" width="17" height="17" fill="#ffffff"/>
                        <rect x="17" y="72" width="11" height="11" fill="#0a1526"/>
                        
                        <rect x="42" y="15" width="16" height="8" fill="#d4af37"/>
                        <rect x="45" y="45" width="12" height="12" fill="#0a1526"/>
                        <rect x="65" y="55" width="25" height="8" fill="#d4af37"/>
                        <rect x="25" y="45" width="10" height="10" fill="#0a1526"/>
                        <rect x="60" y="75" width="15" height="15" fill="#0a1526"/>
                      </svg>
                    </div>
                    <div style={{ fontSize: '0.78rem', color: '#64748b', marginTop: '8px' }}>
                      Scan QR Code with any UPI App (Demo Simulation)
                    </div>
                  </div>

                  <div className="form-group" style={{ marginBottom: 0 }}>
                    <label className="form-label">Simulated UPI ID</label>
                    <input 
                      type="text" 
                      value={upiId}
                      onChange={(e) => setUpiId(e.target.value)}
                      placeholder="e.g. yourname@okhdfcbank"
                      className="form-input"
                    />
                  </div>
                </div>
              )}

              {paymentMethod === 'CARD_DEMO' && (
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', marginBottom: '24px' }}>
                  {/* Luxury Simulated Credit Card */}
                  <div style={{
                    background: 'linear-gradient(135deg, #0a1526 0%, #1f3b64 100%)',
                    borderRadius: '12px',
                    padding: '20px',
                    color: '#ffffff',
                    marginBottom: '16px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    border: '1px solid rgba(212, 175, 55, 0.4)',
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                      <span className="font-cinzel" style={{ color: '#d4af37', fontSize: '0.9rem', fontWeight: '700' }}>
                        VELVET CROWN BLACK
                      </span>
                      <Sparkles size={20} color="#d4af37" />
                    </div>
                    <div style={{ fontFamily: 'monospace', fontSize: '1.2rem', letterSpacing: '2px', marginBottom: '18px' }}>
                      {cardNumber}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', textTransform: 'uppercase' }}>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Cardholder</div>
                        <div>{cardHolder || 'GUEST MEMBER'}</div>
                      </div>
                      <div>
                        <div style={{ fontSize: '0.65rem', color: '#94a3b8' }}>Expires</div>
                        <div>{cardExpiry}</div>
                      </div>
                    </div>
                  </div>

                  <div className="form-group">
                    <label className="form-label">Card Number (Demo)</label>
                    <input 
                      type="text" 
                      value={cardNumber}
                      onChange={(e) => setCardNumber(e.target.value)}
                      className="form-input"
                    />
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">Expiry</label>
                      <input 
                        type="text" 
                        value={cardExpiry}
                        onChange={(e) => setCardExpiry(e.target.value)}
                        className="form-input"
                      />
                    </div>
                    <div className="form-group" style={{ marginBottom: 0 }}>
                      <label className="form-label">CVV (Demo)</label>
                      <input 
                        type="password" 
                        maxLength={3}
                        value={cardCvv}
                        onChange={(e) => setCardCvv(e.target.value)}
                        className="form-input"
                      />
                    </div>
                  </div>
                </div>
              )}

              {paymentMethod === 'CASH_DEMO' && (
                <div style={{ backgroundColor: '#f8fafc', padding: '20px', borderRadius: '10px', marginBottom: '24px', textAlign: 'center' }}>
                  <Banknote size={40} color="#10b981" style={{ margin: '0 auto 10px' }} />
                  <h4 style={{ color: '#1e293b', marginBottom: '6px' }}>Cash on Check-in at Front Desk</h4>
                  <p style={{ color: '#64748b', fontSize: '0.85rem' }}>
                    Payment will be collected by front desk reception when you arrive for check-in.
                  </p>
                </div>
              )}

              {/* Demo Error Simulation Toggle */}
              <div style={{
                background: '#fffbeb',
                border: '1px solid #fde68a',
                padding: '12px 16px',
                borderRadius: '8px',
                marginBottom: '24px',
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
              }}>
                <input 
                  type="checkbox"
                  id="simFailure"
                  checked={simulateFailure}
                  onChange={(e) => setSimulateFailure(e.target.checked)}
                  style={{ width: '18px', height: '18px', accentColor: '#dc2626' }}
                />
                <label htmlFor="simFailure" style={{ fontSize: '0.82rem', color: '#92400e', cursor: 'pointer' }}>
                  <strong>Simulate Payment Gateway Failure</strong> (Demonstrate error handling & rejection)
                </label>
              </div>

              {/* Pay Button */}
              <button
                type="button"
                onClick={handleProcessPayment}
                disabled={processing}
                className="btn-gold"
                style={{ width: '100%', padding: '16px', fontSize: '1rem' }}
              >
                {processing ? 'Processing Simulated Transaction...' : `Pay ₹${grandTotal.toLocaleString('en-IN')} (DEMO)`}
              </button>
            </div>

            {/* Right: Reservation Details Summary */}
            <div className="luxury-card-light" style={{ padding: '32px' }}>
              <h2 style={{ fontSize: '1.35rem', color: 'var(--navy-900)', marginBottom: '20px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
                Reservation Breakdown
              </h2>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Booking Reference:</span>
                  <strong style={{ color: '#0f172a' }}>{booking.bookingReference}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Guest Name:</span>
                  <strong style={{ color: '#0f172a' }}>{booking.guestName}</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Suite Category:</span>
                  <strong style={{ color: '#0f172a' }}>{booking.room.roomType} (Room {booking.room.roomNumber})</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Stay Duration:</span>
                  <strong style={{ color: '#0f172a' }}>{booking.totalNights} Night(s)</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Check-In:</span>
                  <strong style={{ color: '#0f172a' }}>{booking.checkInDate} (2:00 PM)</strong>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: '#64748b' }}>Check-Out:</span>
                  <strong style={{ color: '#0f172a' }}>{booking.checkOutDate} (11:00 AM)</strong>
                </div>

                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '14px', marginTop: '8px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                    <span style={{ color: '#64748b' }}>Base Room Charges:</span>
                    <strong style={{ color: '#0f172a' }}>₹{Number(booking.totalPrice).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '14px' }}>
                    <span style={{ color: '#64748b' }}>Luxury GST (12%):</span>
                    <strong style={{ color: '#0f172a' }}>₹{Math.round(Number(booking.totalPrice) * 0.12).toLocaleString('en-IN')}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', borderTop: '2px solid #e2e8f0', paddingTop: '12px' }}>
                    <span style={{ fontSize: '1.1rem', fontWeight: '800', color: 'var(--navy-900)' }}>Total Due:</span>
                    <span style={{ fontSize: '1.6rem', fontWeight: '800', color: '#b38e22' }}>
                      ₹{grandTotal.toLocaleString('en-IN')}
                    </span>
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

export default PaymentPage;
