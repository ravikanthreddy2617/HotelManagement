import React from 'react';
import { Link } from 'react-router-dom';
import { Crown, MapPin, Phone, Mail, Award, Clock, ShieldCheck } from 'lucide-react';

const Footer = () => {
  return (
    <footer style={{
      backgroundColor: '#050b14',
      color: '#94a3b8',
      borderTop: '2px solid rgba(212, 175, 55, 0.3)',
      paddingTop: '64px',
      paddingBottom: '32px',
      marginTop: 'auto',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '40px',
          marginBottom: '48px',
        }}>
          {/* Col 1: Brand & Philosophy */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '18px' }}>
              <div style={{
                width: '40px',
                height: '40px',
                borderRadius: '50%',
                background: 'var(--gold-gradient)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                boxShadow: '0 0 12px rgba(212, 175, 55, 0.3)'
              }}>
                <Crown size={22} color="#0a1526" strokeWidth={2.2} />
              </div>
              <div>
                <span className="font-cinzel" style={{ fontSize: '1.25rem', fontWeight: '800', color: '#ffffff', letterSpacing: '0.1em' }}>
                  VELVET CROWN
                </span>
                <div style={{ fontSize: '0.65rem', color: '#d4af37', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
                  Hotel & Suites
                </div>
              </div>
            </div>
            <p style={{ fontSize: '0.9rem', lineHeight: '1.7', marginBottom: '20px', color: '#cbd5e1' }}>
              Where timeless royal architecture harmonizes with bespoke contemporary hospitality. An iconic sanctuary perched along the majestic ocean promenade.
            </p>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', padding: '6px 14px', background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)', borderRadius: '20px', fontSize: '0.8rem', color: '#f4dc8f' }}>
              <Award size={16} color="#d4af37" />
              <span>World Luxury Hotel Award 2026 Winner</span>
            </div>
          </div>

          {/* Col 2: Accommodations & Nightly Tariffs */}
          <div>
            <h4 className="font-cinzel" style={{ color: '#ffffff', fontSize: '1rem', letterSpacing: '0.1em', marginBottom: '20px', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '8px' }}>
              ROOMS & SUITES
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.9rem' }}>
              <li>
                <Link to="/rooms" style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Standard Room</span>
                  <span style={{ color: '#d4af37', fontWeight: '600' }}>₹2,500 / night</span>
                </Link>
              </li>
              <li>
                <Link to="/rooms" style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Deluxe Room</span>
                  <span style={{ color: '#d4af37', fontWeight: '600' }}>₹3,500 / night</span>
                </Link>
              </li>
              <li>
                <Link to="/rooms" style={{ display: 'flex', justifyContent: 'space-between', color: '#cbd5e1' }}>
                  <span>Luxury Royal Suite</span>
                  <span style={{ color: '#d4af37', fontWeight: '600' }}>₹5,000 / night</span>
                </Link>
              </li>
              <li style={{ paddingTop: '8px' }}>
                <Link to="/book" style={{ color: '#f4dc8f', textDecoration: 'underline', fontSize: '0.85rem' }}>
                  Check Live Availability &rarr;
                </Link>
              </li>
            </ul>
          </div>

          {/* Col 3: Quick Navigation */}
          <div>
            <h4 className="font-cinzel" style={{ color: '#ffffff', fontSize: '1rem', letterSpacing: '0.1em', marginBottom: '20px', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '8px' }}>
              ROYAL SERVICES
            </h4>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.9rem' }}>
              <li><Link to="/rooms" style={{ color: '#cbd5e1' }}>Luxury Suites Gallery</Link></li>
              <li><Link to="/book" style={{ color: '#cbd5e1' }}>Instant Room Reservation</Link></li>
              <li><Link to="/my-bookings" style={{ color: '#cbd5e1' }}>Booking Management & Receipt</Link></li>
              <li><Link to="/contact" style={{ color: '#cbd5e1' }}>VIP Concierge Helpline</Link></li>
              <li><Link to="/admin" style={{ color: '#cbd5e1' }}>Staff & Management Portal</Link></li>
            </ul>
          </div>

          {/* Col 4: Contact & Location */}
          <div>
            <h4 className="font-cinzel" style={{ color: '#ffffff', fontSize: '1rem', letterSpacing: '0.1em', marginBottom: '20px', borderBottom: '1px solid rgba(212, 175, 55, 0.3)', paddingBottom: '8px' }}>
              ESTATE & CONCIERGE
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px', fontSize: '0.88rem' }}>
              <div style={{ display: 'flex', gap: '10px' }}>
                <MapPin size={20} color="#d4af37" style={{ flexShrink: 0, marginTop: '2px' }} />
                <span>Velvet Crown Palace, Road No. 1, Banjara Hills, Hyderabad, Telangana 500034</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Phone size={18} color="#d4af37" style={{ flexShrink: 0 }} />
                <span>+91 40 8945 7700 / 7701</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Mail size={18} color="#d4af37" style={{ flexShrink: 0 }} />
                <span>concierge@velvetcrown.com</span>
              </div>
              <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                <Clock size={18} color="#d4af37" style={{ flexShrink: 0 }} />
                <span>Check-in: 2:00 PM | Check-out: 11:00 AM</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar: Academic Demo & Copyright */}
        <div style={{
          borderTop: '1px solid rgba(255, 255, 255, 0.1)',
          paddingTop: '24px',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '16px',
          fontSize: '0.82rem',
        }}>
          <div>
            &copy; {new Date().getFullYear()} <strong style={{ color: '#ffffff' }}>Velvet Crown Hotel</strong>. All Rights Reserved.
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '6px', color: '#d4af37' }}>
            <ShieldCheck size={16} />
            <span>Full-Stack Web Engineering Project (Spring Boot 3 + React + MySQL)</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
