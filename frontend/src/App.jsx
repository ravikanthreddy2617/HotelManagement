import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

// Pages
import HomePage from './pages/HomePage';
import RoomsPage from './pages/RoomsPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import BookingPage from './pages/BookingPage';
import MyBookingsPage from './pages/MyBookingsPage';
import PaymentPage from './pages/PaymentPage';
import CheckInPage from './pages/CheckInPage';
import BillingPage from './pages/BillingPage';
import CheckOutPage from './pages/CheckOutPage';
import AdminDashboardPage from './pages/AdminDashboardPage';
import ContactPage from './pages/ContactPage';
import NotFoundPage from './pages/NotFoundPage';

// Scroll to top helper
const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
  return null;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <ScrollToTop />
        <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
          <Navbar />
          <main style={{ flex: 1 }}>
            <Routes>
              {/* 1. Home Page */}
              <Route path="/" element={<HomePage />} />

              {/* 2. Rooms Page */}
              <Route path="/rooms" element={<RoomsPage />} />

              {/* 3. Guest Registration & Login */}
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />

              {/* 4. Booking Page */}
              <Route path="/book" element={<BookingPage />} />

              {/* 5. My Bookings Page */}
              <Route path="/my-bookings" element={<MyBookingsPage />} />

              {/* 6. Demo Payment Page */}
              <Route path="/payment/:bookingId" element={<PaymentPage />} />

              {/* 7. Front Desk Check-In */}
              <Route path="/staff/check-in" element={<CheckInPage />} />

              {/* 8. Billing Page */}
              <Route path="/billing" element={<BillingPage />} />
              <Route path="/billing/:bookingId" element={<BillingPage />} />

              {/* 9. Front Desk Check-Out */}
              <Route path="/staff/check-out" element={<CheckOutPage />} />

              {/* 10. Admin Dashboard */}
              <Route path="/admin" element={<AdminDashboardPage />} />

              {/* 11. Contact Page */}
              <Route path="/contact" element={<ContactPage />} />

              {/* 12. 404 Page */}
              <Route path="*" element={<NotFoundPage />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
