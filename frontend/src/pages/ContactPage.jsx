import React, { useState } from 'react';
import AlertNotification from '../components/AlertNotification';
import { 
  Crown, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Send, 
  CheckCircle2, 
  ShieldCheck, 
  Award 
} from 'lucide-react';

const ContactPage = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: 'General Inquiry',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setLoading(true);
    // Simulate inquiry submission
    setTimeout(() => {
      setLoading(false);
      setSubmitted(true);
    }, 800);
  };

  return (
    <div style={{ padding: '60px 0 96px', backgroundColor: 'var(--cream-50)', minHeight: '90vh' }}>
      <div className="container">
        {/* Title */}
        <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 48px' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#b38e22', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '8px' }}>
            <Crown size={16} /> 24/7 Royal Concierge
          </div>
          <h1 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: 'var(--navy-900)' }}>
            Connect with Velvet Crown
          </h1>
          <p style={{ color: '#64748b', fontSize: '0.98rem' }}>
            Whether arranging bespoke suites, banquet celebrations, or private airport transfers, our royal concierge is at your service
          </p>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
          gap: '40px',
          alignItems: 'start',
        }}>
          {/* Contact Details Card */}
          <div className="luxury-card-light" style={{ padding: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--navy-900)', marginBottom: '24px', borderBottom: '1px solid #f1f5f9', paddingBottom: '12px' }}>
              Estate Location & Desks
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <MapPin size={22} color="#b38e22" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#1e293b', marginBottom: '4px' }}>Estate Address</h4>
                  <p style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    Velvet Crown Palace, Royal Promenade<br />
                    Road No. 1, Banjara Hills, Near Hussain Sagar<br />
                    Hyderabad, Telangana 500034, India
                  </p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Phone size={22} color="#b38e22" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#1e293b', marginBottom: '4px' }}>Telephone & Reservations</h4>
                  <div style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    Reservations: +91 40 8945 7700<br />
                    VIP Concierge Helpline: +91 40 8945 7701<br />
                    Toll-Free (India): 1800 209 8842
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Mail size={22} color="#b38e22" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#1e293b', marginBottom: '4px' }}>Electronic Inquiries</h4>
                  <div style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    Reservations: stay@velvetcrown.com<br />
                    General: concierge@velvetcrown.com<br />
                    Banquets: banquets@velvetcrown.com
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{
                  width: '46px',
                  height: '46px',
                  borderRadius: '10px',
                  background: 'rgba(212, 175, 55, 0.15)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Clock size={22} color="#b38e22" />
                </div>
                <div>
                  <h4 style={{ fontSize: '1rem', color: '#1e293b', marginBottom: '4px' }}>Operating Hours</h4>
                  <div style={{ color: '#64748b', fontSize: '0.88rem', lineHeight: 1.6 }}>
                    Front Desk & Reception: 24 Hours / 7 Days<br />
                    Check-in: 2:00 PM | Check-out: 11:00 AM<br />
                    Fine Dining: 7:00 AM – 11:30 PM
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Interactive Inquiry Form */}
          <div className="luxury-card-light" style={{ padding: '36px' }}>
            <h2 style={{ fontSize: '1.4rem', color: 'var(--navy-900)', marginBottom: '12px' }}>
              Transmit Concierge Inquiry
            </h2>
            <p style={{ color: '#64748b', fontSize: '0.88rem', marginBottom: '24px' }}>
              Our dedicated guest relations team responds within two hours.
            </p>

            {submitted ? (
              <div style={{ textAlign: 'center', padding: '40px 10px' }}>
                <div style={{
                  width: '60px',
                  height: '60px',
                  borderRadius: '50%',
                  background: '#dcfce7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px',
                }}>
                  <CheckCircle2 size={32} color="#16a34a" />
                </div>
                <h3 style={{ fontSize: '1.3rem', color: 'var(--navy-900)', marginBottom: '8px' }}>
                  Inquiry Dispatched Successfully!
                </h3>
                <p style={{ color: '#64748b', fontSize: '0.9rem', marginBottom: '24px' }}>
                  Thank you, <strong>{formData.name}</strong>. A senior concierge officer will contact you shortly via <strong>{formData.email}</strong>.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', subject: 'General Inquiry', message: '' });
                  }}
                  className="btn-navy"
                >
                  Send Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label">Full Name</label>
                  <input 
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Maharani Devika Sen"
                    className="form-input"
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Email Address</label>
                    <input 
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="devika@example.com"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Phone Contact</label>
                    <input 
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+91 98123 45678"
                      className="form-input"
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Subject of Interest</label>
                  <select
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    className="form-select"
                  >
                    <option value="General Inquiry">General Luxury Stay Inquiry</option>
                    <option value="Royal Suite Reservation">Royal Suite Customization</option>
                    <option value="Destination Banquet">Banquet & Destination Wedding</option>
                    <option value="Airport Chauffeur">Airport Chauffeur & Valet</option>
                    <option value="Spa & Wellness">Ayurvedic Spa Booking</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Message Details</label>
                  <textarea 
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Tell us about your scheduled arrival, preferences, or party size..."
                    className="form-textarea"
                  />
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="btn-gold"
                  style={{ width: '100%', padding: '14px', fontSize: '0.95rem' }}
                >
                  {loading ? 'Transmitting Message...' : (
                    <>
                      <Send size={16} />
                      Transmit Inquiry
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;
