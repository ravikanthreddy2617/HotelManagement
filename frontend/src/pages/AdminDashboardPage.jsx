import React, { useState, useEffect } from 'react';
import { adminApi, roomApi, bookingApi, paymentApi } from '../api/axiosConfig';
import AlertNotification from '../components/AlertNotification';
import LoadingSpinner from '../components/LoadingSpinner';
import { 
  Crown, 
  BedDouble, 
  CheckCircle2, 
  DoorClosed, 
  Wrench, 
  CalendarCheck, 
  IndianRupee, 
  Users, 
  Plus, 
  Edit3, 
  Trash2, 
  Receipt, 
  Search,
  Filter,
  RefreshCw,
  DoorOpen,
  LogOut,
  CreditCard
} from 'lucide-react';
import { Link } from 'react-router-dom';

const AdminDashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [rooms, setRooms] = useState([]);
  const [bookings, setBookings] = useState([]);
  const [payments, setPayments] = useState([]);
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Active Tab: 'rooms', 'bookings', 'payments'
  const [activeTab, setActiveTab] = useState('rooms');

  // Room Modal State (Add / Edit)
  const [showRoomModal, setShowRoomModal] = useState(false);
  const [editingRoom, setEditingRoom] = useState(null);
  const [roomFormData, setRoomFormData] = useState({
    roomNumber: '',
    roomType: 'STANDARD',
    pricePerNight: 2500,
    capacity: 2,
    status: 'AVAILABLE',
    description: '',
    imageUrl: '',
    amenities: '',
  });
  const [savingRoom, setSavingRoom] = useState(false);

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    try {
      setLoading(true);
      setError('');

      const [statsRes, roomsRes, bookingsRes, paymentsRes] = await Promise.all([
        adminApi.getStats(),
        roomApi.getRooms(),
        bookingApi.getAllBookings(),
        paymentApi.getAllPayments(),
      ]);

      if (statsRes.success) setStats(statsRes.data);
      if (roomsRes.success) setRooms(roomsRes.data);
      if (bookingsRes.success) setBookings(bookingsRes.data);
      if (paymentsRes.success) setPayments(paymentsRes.data);
    } catch (err) {
      setError(err.message || 'Unable to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  // Open Room Modal
  const handleOpenAddRoom = () => {
    setEditingRoom(null);
    setRoomFormData({
      roomNumber: '',
      roomType: 'STANDARD',
      pricePerNight: 2500,
      capacity: 2,
      status: 'AVAILABLE',
      description: 'Serene luxury accommodation with royal furnishings and ambient illumination.',
      imageUrl: 'https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80',
      amenities: 'High-speed Wi-Fi, King Bed, Smart LED TV, Luxury Toiletries',
    });
    setShowRoomModal(true);
  };

  const handleOpenEditRoom = (room) => {
    setEditingRoom(room);
    setRoomFormData({
      roomNumber: room.roomNumber,
      roomType: room.roomType,
      pricePerNight: room.pricePerNight,
      capacity: room.capacity,
      status: room.status,
      description: room.description || '',
      imageUrl: room.imageUrl || '',
      amenities: room.amenities || '',
    });
    setShowRoomModal(true);
  };

  const handleSaveRoom = async (e) => {
    e.preventDefault();
    setSavingRoom(true);
    setError('');

    try {
      if (editingRoom) {
        const res = await roomApi.updateRoom(editingRoom.id, roomFormData);
        if (res.success) {
          setSuccessMsg(`Room ${roomFormData.roomNumber} updated successfully!`);
        }
      } else {
        const res = await roomApi.createRoom(roomFormData);
        if (res.success) {
          setSuccessMsg(`Room ${roomFormData.roomNumber} created successfully!`);
        }
      }
      setShowRoomModal(false);
      loadAllData();
    } catch (err) {
      setError(err.message || 'Failed to save room details');
    } finally {
      setSavingRoom(false);
    }
  };

  const handleDeleteRoom = async (id, roomNumber) => {
    if (!window.confirm(`Are you sure you want to delete Room ${roomNumber}? This cannot be undone.`)) {
      return;
    }

    try {
      setError('');
      const res = await roomApi.deleteRoom(id);
      if (res.success) {
        setSuccessMsg(`Room ${roomNumber} deleted successfully.`);
        loadAllData();
      }
    } catch (err) {
      setError(err.message || 'Cannot delete room with active bookings.');
    }
  };

  const handleQuickStatusChange = async (roomId, newStatus) => {
    try {
      const res = await roomApi.updateStatus(roomId, newStatus);
      if (res.success) {
        setSuccessMsg(`Room status updated to ${newStatus}`);
        loadAllData();
      }
    } catch (err) {
      setError(err.message || 'Failed to update status');
    }
  };

  return (
    <div style={{ padding: '40px 0 96px', backgroundColor: 'var(--cream-50)', minHeight: '90vh' }}>
      <div className="container">
        {/* Header Title */}
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '16px',
          marginBottom: '32px',
        }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', color: '#b38e22', fontWeight: '700', fontSize: '0.85rem', letterSpacing: '0.15em', textTransform: 'uppercase' }}>
              <Crown size={16} /> Velvet Crown Administration
            </div>
            <h1 style={{ fontSize: 'clamp(1.8rem, 3vw, 2.4rem)', color: 'var(--navy-900)' }}>
              Hotel Management Dashboard
            </h1>
          </div>

          <div style={{ display: 'flex', gap: '10px' }}>
            <Link to="/staff/check-in" className="btn-navy" style={{ fontSize: '0.82rem', padding: '10px 18px' }}>
              <DoorOpen size={16} /> Front Desk Check-In
            </Link>
            <Link to="/staff/check-out" className="btn-navy" style={{ fontSize: '0.82rem', padding: '10px 18px' }}>
              <LogOut size={16} /> Check-Out
            </Link>
            <button onClick={loadAllData} className="btn-outline-gold" style={{ fontSize: '0.82rem', padding: '10px 14px' }}>
              <RefreshCw size={16} />
            </button>
          </div>
        </div>

        {error && <AlertNotification type="error" message={error} onClose={() => setError('')} />}
        {successMsg && <AlertNotification type="success" message={successMsg} onClose={() => setSuccessMsg('')} />}

        {loading ? (
          <LoadingSpinner text="Computing hotel KPIs and database analytics..." />
        ) : (
          <>
            {/* KPI STATS CARDS */}
            {stats && (
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))',
                gap: '20px',
                marginBottom: '36px',
              }}>
                {/* Total Rooms */}
                <div className="luxury-card-light" style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Total Rooms</span>
                    <BedDouble size={20} color="#0a1526" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: 'var(--navy-900)' }}>
                    {stats.totalRooms}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                    Inventory count across 3 tiers
                  </div>
                </div>

                {/* Available Rooms */}
                <div className="luxury-card-light" style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Available Rooms</span>
                    <CheckCircle2 size={20} color="#10b981" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#047857' }}>
                    {stats.availableRooms}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#10b981', marginTop: '4px' }}>
                    Ready for immediate guest check-in
                  </div>
                </div>

                {/* Occupied Rooms */}
                <div className="luxury-card-light" style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Occupied Rooms</span>
                    <DoorClosed size={20} color="#ef4444" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#b91c1c' }}>
                    {stats.occupiedRooms}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                    Currently in-house guests
                  </div>
                </div>

                {/* Total Bookings */}
                <div className="luxury-card-light" style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Total Bookings</span>
                    <CalendarCheck size={20} color="#3b82f6" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#1d4ed8' }}>
                    {stats.totalBookings}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                    {stats.confirmedBookings} confirmed | {stats.cancelledBookings} cancelled
                  </div>
                </div>

                {/* Recorded Revenue */}
                <div className="luxury-card-light" style={{ padding: '22px', borderLeft: '4px solid #d4af37' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Total Revenue</span>
                    <IndianRupee size={20} color="#b38e22" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#b38e22' }}>
                    ₹{Number(stats.totalRevenue).toLocaleString('en-IN')}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                    From recorded demo payments
                  </div>
                </div>

                {/* Registered Guests */}
                <div className="luxury-card-light" style={{ padding: '22px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '0.82rem', color: '#64748b', textTransform: 'uppercase', fontWeight: '600' }}>Registered Accounts</span>
                    <Users size={20} color="#8b5cf6" />
                  </div>
                  <div style={{ fontSize: '2rem', fontWeight: '800', color: '#6d28d9' }}>
                    {stats.totalGuests}
                  </div>
                  <div style={{ fontSize: '0.75rem', color: '#64748b', marginTop: '4px' }}>
                    Guests & administrators
                  </div>
                </div>
              </div>
            )}

            {/* TABS NAVIGATION */}
            <div style={{
              display: 'flex',
              gap: '12px',
              borderBottom: '2px solid #e2e8f0',
              marginBottom: '28px',
            }}>
              {[
                { id: 'rooms', label: `Room Inventory (${rooms.length})`, icon: <BedDouble size={18} /> },
                { id: 'bookings', label: `All Bookings (${bookings.length})`, icon: <CalendarCheck size={18} /> },
                { id: 'payments', label: `Payment Audit Log (${payments.length})`, icon: <CreditCard size={18} /> },
              ].map(tab => {
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    style={{
                      padding: '14px 24px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px',
                      fontWeight: isActive ? '700' : '500',
                      color: isActive ? 'var(--navy-900)' : '#64748b',
                      borderBottom: isActive ? '3px solid #d4af37' : '3px solid transparent',
                      marginBottom: '-2px',
                      fontSize: '0.95rem',
                      transition: 'all 0.2s',
                    }}
                  >
                    {tab.icon}
                    {tab.label}
                  </button>
                );
              })}
            </div>

            {/* TAB 1: ROOM INVENTORY */}
            {activeTab === 'rooms' && (
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                  <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-900)' }}>
                    Room Management Master
                  </h3>
                  <button onClick={handleOpenAddRoom} className="btn-gold" style={{ padding: '10px 20px', fontSize: '0.85rem' }}>
                    <Plus size={16} /> Add New Room
                  </button>
                </div>

                <div className="luxury-card-light" style={{ padding: '20px', overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                    <thead>
                      <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', textTransform: 'uppercase', fontSize: '0.78rem' }}>
                        <th style={{ padding: '12px' }}>Room #</th>
                        <th style={{ padding: '12px' }}>Category</th>
                        <th style={{ padding: '12px' }}>Price / Night</th>
                        <th style={{ padding: '12px' }}>Capacity</th>
                        <th style={{ padding: '12px' }}>Status</th>
                        <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {rooms.map(room => (
                        <tr key={room.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                          <td style={{ padding: '14px 12px', fontWeight: '800', color: 'var(--navy-900)' }}>
                            Room {room.roomNumber}
                          </td>
                          <td style={{ padding: '14px 12px' }}>
                            <span className="badge badge-gold">{room.roomType}</span>
                          </td>
                          <td style={{ padding: '14px 12px', fontWeight: '700' }}>
                            ₹{Number(room.pricePerNight).toLocaleString('en-IN')}
                          </td>
                          <td style={{ padding: '14px 12px' }}>
                            {room.capacity} Guests
                          </td>
                          <td style={{ padding: '14px 12px' }}>
                            <select
                              value={room.status}
                              onChange={(e) => handleQuickStatusChange(room.id, e.target.value)}
                              style={{
                                padding: '4px 10px',
                                borderRadius: '4px',
                                border: '1px solid #cbd5e1',
                                fontSize: '0.78rem',
                                fontWeight: '700',
                                background: room.status === 'AVAILABLE' ? '#ecfdf5' : room.status === 'OCCUPIED' ? '#fef2f2' : '#fffbeb',
                                color: room.status === 'AVAILABLE' ? '#065f46' : room.status === 'OCCUPIED' ? '#991b1b' : '#92400e',
                              }}
                            >
                              <option value="AVAILABLE">AVAILABLE</option>
                              <option value="OCCUPIED">OCCUPIED</option>
                              <option value="MAINTENANCE">MAINTENANCE</option>
                            </select>
                          </td>
                          <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                            <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                              <button
                                onClick={() => handleOpenEditRoom(room)}
                                title="Edit Room"
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  background: '#f1f5f9',
                                  color: '#334155',
                                }}
                              >
                                <Edit3 size={15} />
                              </button>
                              <button
                                onClick={() => handleDeleteRoom(room.id, room.roomNumber)}
                                title="Delete Room"
                                style={{
                                  padding: '6px 10px',
                                  borderRadius: '6px',
                                  background: '#fee2e2',
                                  color: '#dc2626',
                                }}
                              >
                                <Trash2 size={15} />
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* TAB 2: ALL BOOKINGS */}
            {activeTab === 'bookings' && (
              <div className="luxury-card-light" style={{ padding: '24px', overflowX: 'auto' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-900)', marginBottom: '16px' }}>
                  All Hotel Reservations ({bookings.length})
                </h3>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', textTransform: 'uppercase', fontSize: '0.78rem' }}>
                      <th style={{ padding: '12px' }}>Ref #</th>
                      <th style={{ padding: '12px' }}>Guest Details</th>
                      <th style={{ padding: '12px' }}>Room</th>
                      <th style={{ padding: '12px' }}>Stay Dates</th>
                      <th style={{ padding: '12px' }}>Total Price</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px', textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bookings.map(b => (
                      <tr key={b.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 12px', fontWeight: '700', fontFamily: 'monospace' }}>
                          {b.bookingReference}
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <div style={{ fontWeight: '600', color: '#1e293b' }}>{b.guestName}</div>
                          <div style={{ fontSize: '0.78rem', color: '#64748b' }}>{b.guestEmail} | {b.guestPhone}</div>
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          Room {b.room.roomNumber} ({b.room.roomType})
                        </td>
                        <td style={{ padding: '14px 12px', whiteSpace: 'nowrap' }}>
                          {b.checkInDate} to {b.checkOutDate} ({b.totalNights}n)
                        </td>
                        <td style={{ padding: '14px 12px', fontWeight: '700', color: '#b38e22' }}>
                          ₹{Math.round(Number(b.totalPrice) * 1.12).toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <span className={`badge ${b.status === 'CONFIRMED' ? 'badge-success' : b.status === 'CHECKED_IN' ? 'badge-info' : 'badge-danger'}`}>
                            {b.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 12px', textAlign: 'right' }}>
                          <Link 
                            to={`/billing/${b.id}`} 
                            style={{ padding: '6px 12px', borderRadius: '4px', background: '#f1f5f9', color: '#1e293b', fontSize: '0.8rem', fontWeight: '600' }}
                          >
                            Invoice
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {/* TAB 3: PAYMENT TRANSACTIONS */}
            {activeTab === 'payments' && (
              <div className="luxury-card-light" style={{ padding: '24px', overflowX: 'auto' }}>
                <h3 style={{ fontSize: '1.25rem', color: 'var(--navy-900)', marginBottom: '16px' }}>
                  Simulated Payment Audit Records ({payments.length})
                </h3>

                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '2px solid #e2e8f0', color: '#64748b', textTransform: 'uppercase', fontSize: '0.78rem' }}>
                      <th style={{ padding: '12px' }}>Transaction Ref</th>
                      <th style={{ padding: '12px' }}>Booking Ref</th>
                      <th style={{ padding: '12px' }}>Amount</th>
                      <th style={{ padding: '12px' }}>Demo Mode</th>
                      <th style={{ padding: '12px' }}>Payer Details</th>
                      <th style={{ padding: '12px' }}>Status</th>
                      <th style={{ padding: '12px' }}>Timestamp</th>
                    </tr>
                  </thead>
                  <tbody>
                    {payments.map(p => (
                      <tr key={p.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '14px 12px', fontFamily: 'monospace', fontWeight: '700' }}>
                          {p.transactionReference}
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          {p.booking.bookingReference} (Room {p.booking.room.roomNumber})
                        </td>
                        <td style={{ padding: '14px 12px', fontWeight: '800', color: '#b38e22' }}>
                          ₹{Number(p.amount).toLocaleString('en-IN')}
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <span className="badge badge-gold">{p.paymentMethod}</span>
                        </td>
                        <td style={{ padding: '14px 12px', color: '#475569' }}>
                          {p.payerDetails}
                        </td>
                        <td style={{ padding: '14px 12px' }}>
                          <span className={`badge ${p.status === 'SUCCESSFUL' ? 'badge-success' : 'badge-danger'}`}>
                            {p.status}
                          </span>
                        </td>
                        <td style={{ padding: '14px 12px', color: '#64748b', fontSize: '0.8rem' }}>
                          {new Date(p.paymentDate).toLocaleString('en-IN')}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        )}

        {/* ADD / EDIT ROOM MODAL */}
        {showRoomModal && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(5, 11, 20, 0.75)',
            backdropFilter: 'blur(8px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 2600,
            padding: '20px',
          }}>
            <div style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '650px',
              width: '100%',
              padding: '36px',
              maxHeight: '90vh',
              overflowY: 'auto',
              boxShadow: '0 25px 50px rgba(0,0,0,0.3)',
            }}>
              <h2 style={{ fontSize: '1.5rem', color: 'var(--navy-900)', marginBottom: '20px' }}>
                {editingRoom ? `Edit Room ${editingRoom.roomNumber}` : 'Add New Hotel Room'}
              </h2>

              <form onSubmit={handleSaveRoom}>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Room Number</label>
                    <input 
                      type="text"
                      required
                      value={roomFormData.roomNumber}
                      onChange={(e) => setRoomFormData({ ...roomFormData, roomNumber: e.target.value })}
                      placeholder="e.g. 105"
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Room Category</label>
                    <select
                      value={roomFormData.roomType}
                      onChange={(e) => {
                        const type = e.target.value;
                        const defaultPrices = { STANDARD: 2500, DELUXE: 3500, LUXURY: 5000 };
                        setRoomFormData({ 
                          ...roomFormData, 
                          roomType: type,
                          pricePerNight: defaultPrices[type] || 2500
                        });
                      }}
                      className="form-select"
                    >
                      <option value="STANDARD">STANDARD (₹2,500)</option>
                      <option value="DELUXE">DELUXE (₹3,500)</option>
                      <option value="LUXURY">LUXURY (₹5,000)</option>
                    </select>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label className="form-label">Price / Night (₹)</label>
                    <input 
                      type="number"
                      required
                      min={500}
                      value={roomFormData.pricePerNight}
                      onChange={(e) => setRoomFormData({ ...roomFormData, pricePerNight: Number(e.target.value) })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Max Guests</label>
                    <input 
                      type="number"
                      required
                      min={1}
                      max={8}
                      value={roomFormData.capacity}
                      onChange={(e) => setRoomFormData({ ...roomFormData, capacity: Number(e.target.value) })}
                      className="form-input"
                    />
                  </div>

                  <div className="form-group">
                    <label className="form-label">Initial Status</label>
                    <select
                      value={roomFormData.status}
                      onChange={(e) => setRoomFormData({ ...roomFormData, status: e.target.value })}
                      className="form-select"
                    >
                      <option value="AVAILABLE">AVAILABLE</option>
                      <option value="OCCUPIED">OCCUPIED</option>
                      <option value="MAINTENANCE">MAINTENANCE</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Image URL</label>
                  <input 
                    type="url"
                    value={roomFormData.imageUrl}
                    onChange={(e) => setRoomFormData({ ...roomFormData, imageUrl: e.target.value })}
                    placeholder="https://images.unsplash.com/photo-..."
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Amenities (Comma-separated)</label>
                  <input 
                    type="text"
                    value={roomFormData.amenities}
                    onChange={(e) => setRoomFormData({ ...roomFormData, amenities: e.target.value })}
                    placeholder="High-speed Wi-Fi, King Bed, Smart LED TV, Rain Shower"
                    className="form-input"
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Description</label>
                  <textarea 
                    rows={3}
                    value={roomFormData.description}
                    onChange={(e) => setRoomFormData({ ...roomFormData, description: e.target.value })}
                    className="form-textarea"
                  />
                </div>

                <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
                  <button
                    type="button"
                    onClick={() => setShowRoomModal(false)}
                    className="btn-navy"
                    style={{ flex: 1, padding: '12px' }}
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={savingRoom}
                    className="btn-gold"
                    style={{ flex: 1, padding: '12px' }}
                  >
                    {savingRoom ? 'Saving to Database...' : editingRoom ? 'Save Changes' : 'Create Room'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboardPage;
