import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { roomApi } from '../api/axiosConfig';
import RoomCard from '../components/RoomCard';
import RoomModal from '../components/RoomModal';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Crown, 
  Sparkles, 
  Calendar, 
  Users, 
  Search, 
  UtensilsCrossed, 
  Waves, 
  Flower2, 
  Wine, 
  Car, 
  ShieldCheck, 
  Star, 
  ArrowRight,
  CheckCircle2,
  Clock,
  MapPin
} from 'lucide-react';

const HomePage = () => {
  const [featuredRooms, setFeaturedRooms] = useState([]);
  const [loadingRooms, setLoadingRooms] = useState(true);
  const [selectedRoomModal, setSelectedRoomModal] = useState(null);
  
  // Quick Booking Bar State
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [roomType, setRoomType] = useState('ALL');
  const navigate = useNavigate();

  useEffect(() => {
    // Set default check-in tomorrow, check-out in 3 days
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const dayAfter = new Date(tomorrow);
    dayAfter.setDate(dayAfter.getDate() + 2);

    setCheckIn(tomorrow.toISOString().split('T')[0]);
    setCheckOut(dayAfter.toISOString().split('T')[0]);

    fetchRooms();
  }, []);

  const fetchRooms = async () => {
    try {
      setLoadingRooms(true);
      const res = await roomApi.getRooms();
      if (res.success && res.data) {
        // Pick one room from each category for highlights
        const rooms = res.data;
        const std = rooms.find(r => r.roomType === 'STANDARD');
        const dlx = rooms.find(r => r.roomType === 'DELUXE');
        const lux = rooms.find(r => r.roomType === 'LUXURY');
        const selected = [std, dlx, lux].filter(Boolean);
        setFeaturedRooms(selected.length > 0 ? selected : rooms.slice(0, 3));
      }
    } catch (err) {
      console.error('Failed to load featured rooms', err);
    } finally {
      setLoadingRooms(false);
    }
  };

  const handleQuickSearch = (e) => {
    e.preventDefault();
    navigate(`/rooms?checkIn=${checkIn}&checkOut=${checkOut}&roomType=${roomType}`);
  };

  return (
    <div>
      {/* 1. HERO SECTION */}
      <section style={{
        position: 'relative',
        minHeight: '85vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `linear-gradient(to bottom, rgba(5, 11, 20, 0.75), rgba(10, 21, 38, 0.88)), url('https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1920&q=80')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        color: '#ffffff',
        padding: '80px 20px',
      }}>
        <div className="container" style={{ textAlign: 'center', maxWidth: '1000px', zIndex: 2 }}>
          {/* Royal Crest Emblem */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '10px',
            background: 'rgba(212, 175, 55, 0.15)',
            border: '1px solid rgba(212, 175, 55, 0.4)',
            backdropFilter: 'blur(10px)',
            padding: '8px 24px',
            borderRadius: '30px',
            marginBottom: '24px',
          }}>
            <Crown size={20} color="#d4af37" />
            <span style={{
              fontSize: '0.85rem',
              letterSpacing: '0.2em',
              textTransform: 'uppercase',
              color: '#f4dc8f',
              fontWeight: '700'
            }}>
              Where Timeless Grandeur Meets Royal Hospitality
            </span>
          </div>

          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.2rem)',
            fontWeight: '800',
            lineHeight: '1.15',
            marginBottom: '20px',
            color: '#ffffff',
            textShadow: '0 4px 20px rgba(0,0,0,0.5)',
          }}>
            Experience The <span className="gold-text">Velvet Standard</span> of Luxury
          </h1>

          <p style={{
            fontSize: 'clamp(1.05rem, 2vw, 1.25rem)',
            color: '#e2e8f0',
            maxWidth: '750px',
            margin: '0 auto 40px',
            lineHeight: '1.6',
            fontWeight: '300'
          }}>
            Nestled in the prestigious Banjara Hills of Hyderabad, Telangana, Velvet Crown Hotel welcomes discerning guests to an aristocratic sanctuary featuring lavish bespoke suites, Michelin-caliber gastronomy, and 24/7 personal butler service.
          </p>

          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap', marginBottom: '60px' }}>
            <Link to="/book" className="btn-gold" style={{ padding: '16px 36px', fontSize: '0.95rem' }}>
              Book Your Stay
              <ArrowRight size={18} />
            </Link>
            <Link to="/rooms" className="btn-outline-gold" style={{ padding: '15px 32px', fontSize: '0.95rem' }}>
              Explore Suites
            </Link>
          </div>

          {/* Quick Availability Booking Bar */}
          <div className="glass-panel-dark" style={{
            padding: '24px 30px',
            boxShadow: '0 20px 40px rgba(0,0,0,0.4)',
            border: '1px solid rgba(212, 175, 55, 0.35)',
            textAlign: 'left',
          }}>
            <form onSubmit={handleQuickSearch} style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
              gap: '18px',
              alignItems: 'flex-end',
            }}>
              <div>
                <label className="form-label-dark" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={15} color="#d4af37" /> Check-In
                </label>
                <input 
                  type="date" 
                  value={checkIn}
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckIn(e.target.value)}
                  required
                  className="form-input-dark"
                />
              </div>

              <div>
                <label className="form-label-dark" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Calendar size={15} color="#d4af37" /> Check-Out
                </label>
                <input 
                  type="date" 
                  value={checkOut}
                  min={checkIn || new Date().toISOString().split('T')[0]}
                  onChange={(e) => setCheckOut(e.target.value)}
                  required
                  className="form-input-dark"
                />
              </div>

              <div>
                <label className="form-label-dark" style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Crown size={15} color="#d4af37" /> Category
                </label>
                <select 
                  value={roomType}
                  onChange={(e) => setRoomType(e.target.value)}
                  className="form-select-dark"
                >
                  <option value="ALL">All Categories</option>
                  <option value="STANDARD">Standard (₹2,500)</option>
                  <option value="DELUXE">Deluxe (₹3,500)</option>
                  <option value="LUXURY">Luxury (₹5,000)</option>
                </select>
              </div>

              <button type="submit" className="btn-gold" style={{ height: '48px', width: '100%' }}>
                <Search size={18} />
                Check Availability
              </button>
            </form>
          </div>
        </div>
      </section>

      {/* 2. HOTEL INTRODUCTION / ABOUT SECTION */}
      <section style={{ padding: '96px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
            gap: '56px',
            alignItems: 'center',
          }}>
            <div>
              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#b38e22', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase', marginBottom: '12px' }}>
                <Crown size={16} /> Heritage of Excellence
              </div>
              <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', color: 'var(--navy-900)', lineHeight: '1.25', marginBottom: '22px' }}>
                A Sovereign Escape in the Royal City of Pearls, Hyderabad
              </h2>
              <p style={{ color: '#475569', fontSize: '1.05rem', lineHeight: '1.8', marginBottom: '20px' }}>
                Conceived as a tribute to royal Indian artistry and modern European elegance, the <strong>Velvet Crown Hotel</strong> offers an unparalleled sanctuary in Hyderabad, Telangana. From hand-woven silk tapestry in every suite to private scenic balconies, every detail is tailored for royal comfort.
              </p>
              <p style={{ color: '#64748b', fontSize: '0.98rem', lineHeight: '1.8', marginBottom: '32px' }}>
                Whether celebrating a destination wedding, convening an executive summit in Hitec City, or seeking an indulgent weekend retreat, our dedicated concierge team ensures an unforgettable experience.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', marginBottom: '32px' }}>
                <div style={{ borderLeft: '3px solid #d4af37', paddingLeft: '14px' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--navy-900)' }}>100%</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Guest Satisfaction</div>
                </div>
                <div style={{ borderLeft: '3px solid #d4af37', paddingLeft: '14px' }}>
                  <div style={{ fontSize: '1.8rem', fontWeight: '800', color: 'var(--navy-900)' }}>24 / 7</div>
                  <div style={{ fontSize: '0.85rem', color: '#64748b' }}>Royal Concierge & Butler</div>
                </div>
              </div>

              <Link to="/contact" className="btn-navy">
                Inquire With Concierge
              </Link>
            </div>

            <div style={{ position: 'relative' }}>
              <div style={{
                borderRadius: '16px',
                overflow: 'hidden',
                boxShadow: '0 20px 40px rgba(5, 11, 20, 0.15)',
                border: '8px solid #ffffff',
              }}>
                <img 
                  src="https://images.unsplash.com/photo-1566073771259-6a8506099945?auto=format&fit=crop&w=1000&q=80" 
                  alt="Velvet Crown Hotel Architecture" 
                  style={{ width: '100%', height: '480px', objectFit: 'cover' }}
                />
              </div>
              <div style={{
                position: 'absolute',
                bottom: '-25px',
                left: '-20px',
                background: 'var(--navy-900)',
                color: '#ffffff',
                padding: '24px',
                borderRadius: '12px',
                border: '1px solid #d4af37',
                boxShadow: '0 10px 25px rgba(0,0,0,0.3)',
                maxWidth: '260px'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '4px', marginBottom: '6px' }}>
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} size={16} fill="#d4af37" color="#d4af37" />
                  ))}
                </div>
                <div style={{ fontSize: '0.9rem', fontWeight: '700', color: '#f4dc8f' }}>Five-Star Royal Category</div>
                <div style={{ fontSize: '0.78rem', color: '#cbd5e1' }}>Recognized as Hyderabad's Premier Luxury Heritage Destination, Telangana</div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ROOM HIGHLIGHTS SECTION */}
      <section style={{ padding: '96px 0', backgroundColor: 'var(--cream-50)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 56px' }}>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b38e22', fontWeight: '700' }}>
              Royal Accommodations
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', color: 'var(--navy-900)', marginTop: '8px', marginBottom: '16px' }}>
              Distinctive Suites & Tariffs
            </h2>
            <p style={{ color: '#64748b', fontSize: '1rem' }}>
              Discover our signature room categories, each tailored with distinct aesthetic charms, artisanal amenities, and serene comfort.
            </p>
          </div>

          {loadingRooms ? (
            <LoadingSpinner text="Loading featured suites..." />
          ) : (
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
              marginBottom: '48px',
            }}>
              {featuredRooms.map(room => (
                <RoomCard 
                  key={room.id} 
                  room={room} 
                  onSelectDetails={(r) => setSelectedRoomModal(r)} 
                />
              ))}
            </div>
          )}

          <div style={{ textAlign: 'center' }}>
            <Link to="/rooms" className="btn-gold" style={{ padding: '14px 38px' }}>
              View All 12 Suites & Check Rates
              <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* 4. WORLD-CLASS FACILITIES & EXPERIENCES */}
      <section style={{ padding: '96px 0', backgroundColor: 'var(--navy-950)', color: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 64px' }}>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#d4af37', fontWeight: '700' }}>
              Unrivaled Experiences
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', color: '#ffffff', marginTop: '8px', marginBottom: '16px' }}>
              Curated Amenities for the Discerning Guest
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '1rem' }}>
              Indulge in an exquisite blend of holistic wellness, world-class culinary mastery, and effortless leisure.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
            gap: '28px',
          }}>
            {/* Facility 1 */}
            <div className="glass-panel-dark" style={{ padding: '36px 28px', transition: 'transform 0.3s' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <UtensilsCrossed size={28} color="#d4af37" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#ffffff' }}>The Crown Jewel Fine Dining</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Multi-award-winning restaurant featuring regal Indian royalty recipes, contemporary fusion cuisine, and an extensive sommelier wine cellar.
              </p>
            </div>

            {/* Facility 2 */}
            <div className="glass-panel-dark" style={{ padding: '36px 28px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Flower2 size={28} color="#d4af37" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#ffffff' }}>Aura Royal Ayurvedic Spa</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Rejuvenate body and soul with restorative Ayurvedic massages, botanical steam therapies, and organic luxury treatments.
              </p>
            </div>

            {/* Facility 3 */}
            <div className="glass-panel-dark" style={{ padding: '36px 28px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Waves size={28} color="#d4af37" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#ffffff' }}>Oceanview Horizon Pool</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Temperature-controlled infinity pool offering panoramic sunset views across the Arabian Sea with private cabanas and cocktail service.
              </p>
            </div>

            {/* Facility 4 */}
            <div className="glass-panel-dark" style={{ padding: '36px 28px' }}>
              <div style={{ width: '56px', height: '56px', borderRadius: '12px', background: 'rgba(212, 175, 55, 0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '20px' }}>
                <Car size={28} color="#d4af37" />
              </div>
              <h3 style={{ fontSize: '1.25rem', marginBottom: '12px', color: '#ffffff' }}>Valet & Chauffeur Fleet</h3>
              <p style={{ color: '#94a3b8', fontSize: '0.9rem', lineHeight: '1.6' }}>
                Complimentary valet parking and chauffeured airport transfers in our private fleet of luxury sedans and limousines.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. GUEST TESTIMONIALS */}
      <section style={{ padding: '96px 0', backgroundColor: '#ffffff' }}>
        <div className="container">
          <div style={{ textAlign: 'center', maxWidth: '700px', margin: '0 auto 60px' }}>
            <span style={{ fontSize: '0.85rem', letterSpacing: '0.2em', textTransform: 'uppercase', color: '#b38e22', fontWeight: '700' }}>
              Words of Distinction
            </span>
            <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.6rem)', color: 'var(--navy-900)', marginTop: '8px', marginBottom: '16px' }}>
              What Our Honored Guests Say
            </h2>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
            gap: '30px',
          }}>
            {[
              {
                quote: "The Velvet Royal Suite was beyond breathtaking. The attention to detail, personalized butler, and sunset views from the terrace created an unforgettable anniversary.",
                author: "Vikram & Ananya Singhania",
                stay: "Stayed in Royal Luxury Suite (Suite 301)",
              },
              {
                quote: "As a frequent international traveler, the level of hospitality at Velvet Crown is truly world-class. Seamless check-in, magnificent rooms, and extraordinary culinary experiences.",
                author: "Dr. Evelyn Vance",
                stay: "Stayed in Grand Deluxe Room (Room 202)",
              },
              {
                quote: "From the warm welcome at the grand portico to the tranquil spa treatments, our family felt truly pampered. The Standard room offered incredible luxury and value.",
                author: "Rajesh & Meera Kapoor",
                stay: "Stayed in Standard Room (Room 101)",
              }
            ].map((review, idx) => (
              <div key={idx} className="luxury-card-light" style={{ padding: '36px 30px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                <div>
                  <div style={{ display: 'flex', gap: '4px', marginBottom: '16px' }}>
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={18} fill="#d4af37" color="#d4af37" />
                    ))}
                  </div>
                  <p style={{ color: '#334155', fontStyle: 'italic', lineHeight: '1.7', marginBottom: '24px', fontSize: '0.98rem' }}>
                    "{review.quote}"
                  </p>
                </div>
                <div style={{ borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <div style={{ fontWeight: '700', color: 'var(--navy-900)', fontSize: '1rem' }}>{review.author}</div>
                  <div style={{ fontSize: '0.8rem', color: '#b38e22' }}>{review.stay}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6. CALL TO ACTION BANNER */}
      <section style={{
        padding: '80px 0',
        backgroundColor: 'var(--navy-900)',
        borderTop: '2px solid rgba(212, 175, 55, 0.3)',
        textAlign: 'center',
        color: '#ffffff',
      }}>
        <div className="container" style={{ maxWidth: '800px' }}>
          <Crown size={38} color="#d4af37" style={{ margin: '0 auto 16px' }} />
          <h2 style={{ fontSize: 'clamp(2rem, 3.5vw, 2.8rem)', marginBottom: '16px', color: '#ffffff' }}>
            Ready to Begin Your Royal Sojourn?
          </h2>
          <p style={{ color: '#cbd5e1', fontSize: '1.05rem', lineHeight: '1.7', marginBottom: '36px' }}>
            Secure your preferred dates today at guaranteed best tariff. Complimentary luxury airport pickup included for all Royal Suite reservations.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '16px', flexWrap: 'wrap' }}>
            <Link to="/book" className="btn-gold" style={{ padding: '16px 40px', fontSize: '0.95rem' }}>
              Book Your Stay Now
            </Link>
            <Link to="/contact" className="btn-outline-gold" style={{ padding: '15px 32px', fontSize: '0.95rem' }}>
              Contact Concierge
            </Link>
          </div>
        </div>
      </section>

      {/* Room Modal */}
      {selectedRoomModal && (
        <RoomModal 
          room={selectedRoomModal} 
          onClose={() => setSelectedRoomModal(null)} 
        />
      )}
    </div>
  );
};

export default HomePage;
