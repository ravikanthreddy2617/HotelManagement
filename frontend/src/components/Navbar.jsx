import React, { useState } from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { 
  Crown, 
  Menu, 
  X, 
  User, 
  LogOut, 
  ShieldCheck, 
  CalendarCheck, 
  DoorOpen, 
  Sparkles,
  BedDouble,
  PhoneCall,
  LayoutDashboard
} from 'lucide-react';

const Navbar = () => {
  const { user, isAuthenticated, isAdmin, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate('/');
  };

  const navLinkStyle = ({ isActive }) => ({
    color: isActive ? '#f4dc8f' : '#f8fafc',
    fontWeight: isActive ? '700' : '500',
    borderBottom: isActive ? '2px solid #d4af37' : '2px solid transparent',
    paddingBottom: '4px',
    transition: 'all 0.2s ease',
  });

  return (
    <nav style={{
      backgroundColor: 'rgba(10, 21, 38, 0.95)',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid rgba(212, 175, 55, 0.25)',
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      boxShadow: '0 4px 20px rgba(5, 11, 20, 0.4)'
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '80px',
      }}>
        {/* Hotel Crest & Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '14px', textDecoration: 'none' }}>
          <div style={{
            width: '46px',
            height: '46px',
            borderRadius: '50%',
            background: 'linear-gradient(135deg, #f8e59f 0%, #d4af37 50%, #aa841c 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(212, 175, 55, 0.4)',
            border: '2px solid #fff'
          }}>
            <Crown size={26} color="#0a1526" strokeWidth={2.2} />
          </div>
          <div>
            <span className="font-cinzel" style={{
              fontSize: '1.35rem',
              fontWeight: '800',
              color: '#ffffff',
              letterSpacing: '0.12em',
              display: 'block',
              lineHeight: 1.1
            }}>
              VELVET CROWN
            </span>
            <span style={{
              fontSize: '0.68rem',
              letterSpacing: '0.28em',
              color: '#d4af37',
              textTransform: 'uppercase',
              fontWeight: '600'
            }}>
              Hotel & Suites
            </span>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        <div style={{
          display: 'none',
          alignItems: 'center',
          gap: '28px',
        }} className="desktop-nav">
          <NavLink to="/" style={navLinkStyle}>Home</NavLink>
          <NavLink to="/rooms" style={navLinkStyle}>Rooms & Suites</NavLink>
          <NavLink to="/book" style={navLinkStyle}>Book Stay</NavLink>
          <NavLink to="/my-bookings" style={navLinkStyle}>My Bookings</NavLink>
          <NavLink to="/contact" style={navLinkStyle}>Contact</NavLink>

          {/* Staff & Admin links */}
          {isAdmin && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginLeft: '8px' }}>
              <NavLink to="/admin" style={navLinkStyle}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                  <LayoutDashboard size={16} color="#d4af37" />
                  Admin
                </span>
              </NavLink>
              <NavLink to="/staff/check-in" style={navLinkStyle}>Check-In</NavLink>
              <NavLink to="/staff/check-out" style={navLinkStyle}>Check-Out</NavLink>
            </div>
          )}
        </div>

        {/* Right Section: Auth & CTA */}
        <div style={{ display: 'none', alignItems: 'center', gap: '16px' }} className="desktop-auth">
          {isAuthenticated ? (
            <div style={{ position: 'relative' }}>
              <button 
                onClick={() => setDropdownOpen(!dropdownOpen)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px',
                  background: 'rgba(212, 175, 55, 0.1)',
                  border: '1px solid rgba(212, 175, 55, 0.35)',
                  borderRadius: '30px',
                  padding: '6px 14px 6px 8px',
                  color: '#ffffff',
                  transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: '32px',
                  height: '32px',
                  borderRadius: '50%',
                  background: '#d4af37',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#0a1526'
                }}>
                  <User size={18} strokeWidth={2.5} />
                </div>
                <div style={{ textAlign: 'left', lineHeight: 1.2 }}>
                  <div style={{ fontSize: '0.85rem', fontWeight: '600', maxWidth: '120px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {user.name.split(' ')[0]}
                  </div>
                  <div style={{ fontSize: '0.68rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {user.role === 'ROLE_ADMIN' ? 'Admin' : 'Guest'}
                  </div>
                </div>
              </button>

              {/* User Dropdown */}
              {dropdownOpen && (
                <div style={{
                  position: 'absolute',
                  right: 0,
                  top: '115%',
                  width: '210px',
                  backgroundColor: '#0f1f38',
                  border: '1px solid rgba(212, 175, 55, 0.3)',
                  borderRadius: '12px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.4)',
                  padding: '8px 0',
                  zIndex: 1100,
                }}>
                  <div style={{ padding: '8px 16px', borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
                    <div style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Signed in as</div>
                    <div style={{ fontSize: '0.88rem', fontWeight: '600', color: '#ffffff', wordBreak: 'break-all' }}>
                      {user.email}
                    </div>
                  </div>

                  <Link 
                    to="/my-bookings" 
                    onClick={() => setDropdownOpen(false)}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      padding: '10px 16px',
                      color: '#f8fafc',
                      fontSize: '0.88rem',
                      transition: 'background 0.2s',
                    }}
                  >
                    <CalendarCheck size={16} color="#d4af37" />
                    My Bookings
                  </Link>

                  {isAdmin && (
                    <>
                      <Link 
                        to="/admin" 
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 16px',
                          color: '#f8fafc',
                          fontSize: '0.88rem',
                        }}
                      >
                        <ShieldCheck size={16} color="#d4af37" />
                        Admin Dashboard
                      </Link>
                      <Link 
                        to="/staff/check-in" 
                        onClick={() => setDropdownOpen(false)}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: '10px',
                          padding: '10px 16px',
                          color: '#f8fafc',
                          fontSize: '0.88rem',
                        }}
                      >
                        <DoorOpen size={16} color="#d4af37" />
                        Staff Check-In
                      </Link>
                    </>
                  )}

                  <button 
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: '10px',
                      width: '100%',
                      padding: '10px 16px',
                      color: '#f87171',
                      fontSize: '0.88rem',
                      borderTop: '1px solid rgba(255,255,255,0.1)',
                      textAlign: 'left',
                    }}
                  >
                    <LogOut size={16} />
                    Sign Out
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <Link to="/login" style={{
                color: '#ffffff',
                fontSize: '0.9rem',
                fontWeight: '600',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'color 0.2s',
              }}>
                Sign In
              </Link>
              <Link to="/register" style={{
                border: '1px solid rgba(212, 175, 55, 0.4)',
                color: '#f4dc8f',
                fontSize: '0.85rem',
                fontWeight: '600',
                padding: '8px 16px',
                borderRadius: '6px',
                transition: 'all 0.2s',
              }}>
                Register
              </Link>
            </div>
          )}

          <Link to="/book" className="btn-gold" style={{ padding: '10px 22px', fontSize: '0.82rem' }}>
            Book Stay
          </Link>
        </div>

        {/* Mobile Hamburger Button */}
        <button 
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ display: 'flex', color: '#ffffff', padding: '8px' }}
          className="mobile-toggle"
        >
          {mobileMenuOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div style={{
          backgroundColor: '#0a1526',
          borderTop: '1px solid rgba(212, 175, 55, 0.2)',
          padding: '24px',
          display: 'flex',
          flexDirection: 'column',
          gap: '16px',
        }} className="mobile-menu">
          <Link to="/" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: '500' }}>Home</Link>
          <Link to="/rooms" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: '500' }}>Rooms & Suites</Link>
          <Link to="/book" onClick={() => setMobileMenuOpen(false)} style={{ color: '#f4dc8f', fontSize: '1.05rem', fontWeight: '600' }}>Book Stay</Link>
          <Link to="/my-bookings" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: '500' }}>My Bookings</Link>
          <Link to="/contact" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', fontSize: '1.05rem', fontWeight: '500' }}>Contact</Link>
          
          {isAdmin && (
            <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '12px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div style={{ fontSize: '0.78rem', color: '#d4af37', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Staff & Admin</div>
              <Link to="/admin" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', fontSize: '1rem' }}>Admin Dashboard</Link>
              <Link to="/staff/check-in" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', fontSize: '1rem' }}>Front Desk Check-In</Link>
              <Link to="/staff/check-out" onClick={() => setMobileMenuOpen(false)} style={{ color: '#ffffff', fontSize: '1rem' }}>Front Desk Check-Out</Link>
            </div>
          )}

          <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {isAuthenticated ? (
              <button onClick={handleLogout} style={{ color: '#f87171', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <LogOut size={18} /> Sign Out ({user.name})
              </button>
            ) : (
              <div style={{ display: 'flex', gap: '12px' }}>
                <Link to="/login" onClick={() => setMobileMenuOpen(false)} className="btn-outline-gold" style={{ flex: 1, textAlign: 'center' }}>Sign In</Link>
                <Link to="/register" onClick={() => setMobileMenuOpen(false)} className="btn-gold" style={{ flex: 1, textAlign: 'center' }}>Register</Link>
              </div>
            )}
          </div>
        </div>
      )}

      <style>{`
        @media (min-width: 992px) {
          .desktop-nav { display: flex !important; }
          .desktop-auth { display: flex !important; }
          .mobile-toggle { display: none !important; }
          .mobile-menu { display: none !important; }
        }
      `}</style>
    </nav>
  );
};

export default Navbar;
