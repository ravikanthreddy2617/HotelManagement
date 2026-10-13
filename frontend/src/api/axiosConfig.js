import axios from 'axios';

const configuredApiOrigin = import.meta.env.VITE_API_BASE_URL?.trim();
const apiBaseURL = configuredApiOrigin
  ? `${configuredApiOrigin.startsWith('http') ? '' : 'https://'}${configuredApiOrigin.replace(/\/$/, '')}/api`
  : '/api';

const api = axios.create({
  baseURL: apiBaseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Attach demo token to headers if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('vc_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Intercept responses and unwrap data, or handle error messages cleanly
api.interceptors.response.use(
  (response) => response.data,
  (error) => {
    let errorMessage = 'An unexpected error occurred. Please try again.';
    if (error.response && error.response.data) {
      if (typeof error.response.data === 'string') {
        errorMessage = error.response.data;
      } else if (error.response.data.message) {
        errorMessage = error.response.data.message;
      }
    } else if (error.message) {
      errorMessage = error.message;
    }
    return Promise.reject(new Error(errorMessage));
  }
);

export default api;

// API Services
export const authApi = {
  login: (credentials) => api.post('/auth/login', credentials),
  register: (data) => api.post('/auth/register', data),
  getUsers: () => api.get('/auth/users'),
};

export const roomApi = {
  getRooms: (params) => api.get('/rooms', { params }),
  getRoomById: (id) => api.get(`/rooms/${id}`),
  createRoom: (roomData) => api.post('/rooms', roomData),
  updateRoom: (id, roomData) => api.put(`/rooms/${id}`, roomData),
  deleteRoom: (id) => api.delete(`/rooms/${id}`),
  updateStatus: (id, status) => api.patch(`/rooms/${id}/status`, { status }),
};

export const bookingApi = {
  createBooking: (data) => api.post('/bookings', data),
  getAllBookings: (status) => api.get('/bookings', { params: { status } }),
  getBookingById: (id) => api.get(`/bookings/${id}`),
  getBookingByRef: (ref) => api.get(`/bookings/ref/${ref}`),
  getBookingsByUser: (userId) => api.get(`/bookings/user/${userId}`),
  getBookingsByEmail: (email) => api.get(`/bookings/by-email`, { params: { email } }),
  cancelBooking: (id) => api.post(`/bookings/${id}/cancel`),
};

export const paymentApi = {
  processPayment: (data) => api.post('/payments', data),
  getPaymentByBooking: (bookingId) => api.get(`/payments/booking/${bookingId}`),
  getPaymentByRef: (ref) => api.get(`/payments/ref/${ref}`),
  getAllPayments: () => api.get('/payments'),
};

export const checkInOutApi = {
  checkIn: (data) => api.post('/check-in', data),
  checkOut: (data) => api.post('/check-out', data),
  getAudit: (bookingId) => api.get(`/check-in-out/${bookingId}`),
};

export const billingApi = {
  getBill: (bookingId) => api.get(`/billing/${bookingId}`),
  getBillByInvoice: (invoiceNo) => api.get(`/billing/invoice/${invoiceNo}`),
};

export const adminApi = {
  getStats: () => api.get('/admin/dashboard/stats'),
};
