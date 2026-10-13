# 👑 Velvet Crown Hotel — Full-Stack Hotel Management System

A modern, full-stack enterprise Hotel Management System designed with luxury aesthetics, built with **React.js + Vite**, **Java 17 + Spring Boot 3**, and **MySQL**. Tailored for college final-year project demonstrations, viva examinations, and real-world hospitality management.

---

## 🏛️ 1. Project Overview & Architecture

**Velvet Crown Hotel** is a 5-star luxury heritage hotel web application situated in Banjara Hills, Hyderabad, Telangana. The system manages the complete guest lifecycle: from room discovery and booking to simulated payments, front desk check-in, automated invoice billing, departure check-out, and administrative dashboard analytics.

```
HotelManagement/
├── backend/                  # Spring Boot 3 + Java 17 + Maven Application
│   ├── src/main/java/com/velvetcrown/hotel/
│   │   ├── config/           # SecurityConfig, DatabaseInitializer, CORS
│   │   ├── controller/       # REST Controllers (Auth, Rooms, Bookings, Payments, etc.)
│   │   ├── dto/              # Request / Response Data Transfer Objects
│   │   ├── entity/           # JPA Entities (User, Room, Booking, Payment, Bill, CheckInOut)
│   │   ├── exception/        # Global Exception Handler & Custom Exceptions
│   │   ├── repository/       # Spring Data JPA Repositories
│   │   └── service/          # Business Logic & Validation Services
│   ├── src/main/resources/
│   │   ├── application.properties         # Base Spring Boot configuration
│   │   ├── application-mysql.properties   # MySQL production database profile
│   │   └── application-dev.properties     # Fallback persistent H2 profile
│   └── pom.xml               # Maven dependencies and build plugins
├── frontend/                 # React.js 18 + Vite + Lucide Icons Application
│   ├── src/
│   │   ├── api/              # Axios instance & typed API service helpers
│   │   ├── context/          # AuthContext (Role-based access: Guest / Admin)
│   │   ├── components/       # Navbar, Footer, RoomCard, RoomModal, AlertNotification, Spinner
│   │   ├── pages/            # 12 Core Pages (Home, Rooms, Book, Pay, CheckIn, Billing, etc.)
│   │   ├── App.jsx           # React Router DOM configuration
│   │   ├── index.css         # Luxury Navy & Champagne Gold design system
│   │   └── main.jsx          # React DOM entry point
│   ├── vite.config.js        # Vite config with API reverse proxy
│   └── package.json          # Frontend dependencies
├── database/                 # MySQL Database Scripts
│   ├── hotel_management_schema.sql  # DDL table creation script
│   ├── sample_data.sql              # Initial 12 luxury rooms & demo accounts
│   └── README.md                    # Detailed MySQL setup guide
├── .env.example              # Sample environment variables
├── .gitignore                # Git exclusions
└── README.md                 # Complete documentation & viva guide
```

---

## 💎 2. Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 18, Vite, React Router DOM v6, Axios, Lucide React Icons, Vanilla CSS Design System |
| **Backend** | Java 17, Spring Boot 3.2.4, Spring Web, Spring Data JPA, Hibernate, Spring Security (BCrypt) |
| **Database** | MySQL 8.x (`hotel_management`), Spring Data JPA, ANSI SQL Scripts |
| **Build Tools** | Apache Maven 3.9.x, Node.js (v18+), npm |
| **Security** | BCrypt Password Hashing, Role-Based Access Control (`ROLE_GUEST`, `ROLE_ADMIN`), CORS filter |

---

## 🛎️ 3. Room Categories & Standard Nightly Tariffs

| Category | Nightly Tariff | Description & Inclusions |
| :--- | :--- | :--- |
| **Standard Room** | **₹2,500** / night | Cozy courtyard-facing room, queen bed, rainfall shower, smart LED TV, work desk, complimentary breakfast |
| **Deluxe Room** | **₹3,500** / night | Skyline & ocean views, king bed, Italian marble bath, gourmet minibar, private balcony, bathrobes |
| **Luxury Suite** | **₹5,000** / night | Royal Penthouse Suite, oceanfront terrace, private jacuzzi, 24/7 personal butler service, complimentary airport limousine |

---

## 🔑 4. Demo Accounts for Immediate Presentation

The application includes convenient **One-Click Quick Fill buttons** on the Login page for demonstration during project evaluations:

| User Type | Email | Password | Role | Permissions |
| :--- | :--- | :--- | :--- | :--- |
| **Hotel Administrator** | `admin@velvetcrown.com` | `admin123` | `ROLE_ADMIN` | Admin Dashboard, Room CRUD, Check-In, Check-Out, All Bookings & Revenue |
| **Demo Guest** | `guest@velvetcrown.com` | `guest123` | `ROLE_GUEST` | Room booking, Demo Payment simulation, View My Bookings, Download Tax Invoice |

---

## 🚀 5. Quick Start Instructions (Running Locally)

### Prerequisites:
1. **Java 17** (or compatible JDK)
2. **Maven 3.8+**
3. **Node.js** (v18+) and **npm**
4. **MySQL Server** (Optional: the backend automatically supports self-contained persistent mode if MySQL is not yet configured!)

---

### Step A: Start the Spring Boot Backend

Open a terminal in the root directory:

```bash
# Navigate to backend directory
cd backend

# Option 1: Run with MySQL (Default)
mvn spring-boot:run

# Option 2: Run with self-contained persistent database (instant demo without starting MySQL service)
mvn spring-boot:run -Dspring-boot.run.profiles=dev
```

The Spring Boot backend will start on **`http://localhost:8080`**.
On startup, it automatically seeds:
- 12 pre-configured rooms across Standard, Deluxe, and Luxury suites
- Admin (`admin@velvetcrown.com`) and Guest (`guest@velvetcrown.com`) credentials
- Sample confirmed booking and demo transaction for instant analytics

---

### Step B: Start the React Frontend

Open a new terminal window in the root directory:

```bash
# Navigate to frontend directory
cd frontend

# Install dependencies (already prepared)
npm install --legacy-peer-deps

# Start Vite development server
npm run dev
```

The frontend will start instantly on **`http://localhost:3000`**.
Open your browser and navigate to:
👉 **[http://localhost:3000](http://localhost:3000)**

---

## 🌐 6. Overview of Required Frontend Pages

1. **Home Page (`/`)**:
   - Royal Crest emblem, Hero section with hotel tagline
   - Interactive Quick Availability Booking Bar (Check-in, Check-out, Category)
   - Hotel Heritage introduction & statistics
   - Signature Room highlights with direct reservation buttons
   - World-Class Amenities: Fine Dining, Royal Spa, Horizon Pool, Valet Chauffeur
   - Five-star guest testimonials & Call-to-action banner
2. **Rooms & Suites Page (`/rooms`)**:
   - Filter by categories: All, Standard (₹2,500), Deluxe (₹3,500), Luxury (₹5,000)
   - Real-time date availability search with backend validation
   - High-definition room cards with nightly pricing, capacity, and amenities
   - Room modal inspection displaying complete specifications
3. **Guest Login (`/login`)**:
   - Secure authentication with BCrypt password verification
   - **One-click demo quick-fill buttons** for Guest and Administrator
4. **Guest Registration (`/register`)**:
   - Full Name, Email, Phone, Password, and Role selection
5. **Booking Page (`/book` or `/book?roomId=...`)**:
   - Dynamic room switcher with live tariff display
   - Interactive check-in and check-out date pickers with validation
   - Automated real-time pricing: **Nights × Tariff + 12% GST = Grand Total**
   - Live database overlap validation (prevents double bookings)
   - Generates unique reference (e.g. `VC-2026-7334`) and redirects to demo payment
6. **Demo Payment System (`/payment/:bookingId`)**:
   - Simulated payment gateway clearly marked as DEMO
   - Supports **UPI Demo** (QR code generator & UPI apps), **Card Demo** (simulated credit card with CVV), and **Cash Demo**
   - **Error Handling Demonstration Toggle**: Simulate payment rejection on demand
   - Prevents duplicate successful payments for the same booking
   - Generates unique transaction reference (e.g. `TXN-UPI-956354-208289`)
   - Official luxury payment receipt with print/download capability
7. **Front Desk Check-In (`/staff/check-in`)**:
   - Staff tool to search reservations by Reference, Name, or Room #
   - Verifies payment status and records staff name & keycard notes
   - Updates booking status to `CHECKED_IN` and room status to `OCCUPIED`
8. **Billing & Tax Invoice Page (`/billing/:bookingId`)**:
   - Official Hotel Tax Invoice with GSTIN and Velvet Crown Crest
   - Itemized breakdown of room charges, stay duration, 12% GST, and total
   - Full `@media print` styling for clean A4 printing
9. **Front Desk Check-Out (`/staff/check-out`)**:
   - Lists in-house guests currently checked in
   - Records departure verification and notes
   - Updates booking status to `CHECKED_OUT` and **releases room back to `AVAILABLE`**
10. **Admin Dashboard (`/admin`)**:
    - High-level KPIs: Total Rooms, Available, Occupied, Bookings count, Total Revenue (₹) from recorded payments, Registered Guests
    - **Room Inventory Master**: Add Room, Edit Room, Delete Room, and toggle status
    - **All Bookings**: Master view with status filter and search
    - **Payment Audit Log**: Historical log of all recorded demo transactions
11. **Contact Page (`/contact`)**:
    - Royal estate address in Banjara Hills, Hyderabad, Telangana
    - 24/7 concierge phone numbers and VIP email
    - Working interactive inquiry form with submission confirmation
12. **404 Not Found Page (`*`)**:
    - Regal "Lost in the Palace?" page with return navigation

---

## 📡 7. Backend REST API Documentation

All API endpoints return a uniform JSON wrapper:
```json
{
  "success": true,
  "message": "Operation message",
  "data": { ... },
  "timestamp": "2026-10-12T23:18:10.083"
}
```

### Authentication & Users
| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Register new guest or staff | `{ "name", "email", "password", "phone", "role" }` |
| `POST` | `/api/auth/login` | Authenticate guest or admin | `{ "email", "password" }` |
| `GET` | `/api/auth/users` | List all registered users (Admin) | None |

### Room Management
| Method | Endpoint | Description | Query / Body Params |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/rooms` | Get rooms (supports filters) | `?checkIn=...&checkOut=...&roomType=...` |
| `GET` | `/api/rooms/{id}` | Get room by ID | None |
| `POST` | `/api/rooms` | Create new hotel room (Admin) | `{ "roomNumber", "roomType", "pricePerNight", "capacity", ... }` |
| `PUT` | `/api/rooms/{id}` | Update room details (Admin) | Room DTO |
| `DELETE` | `/api/rooms/{id}` | Delete room (Admin) | None |
| `PATCH` | `/api/rooms/{id}/status` | Update room status | `{ "status": "AVAILABLE" / "OCCUPIED" / "MAINTENANCE" }` |

### Booking Management
| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/bookings` | Create reservation with date checks | `{ "roomId", "guestName", "guestEmail", "guestPhone", "checkInDate", "checkOutDate" }` |
| `GET` | `/api/bookings` | Get all bookings (optional status filter) | `?status=CONFIRMED` |
| `GET` | `/api/bookings/{id}` | Get booking by ID | None |
| `GET` | `/api/bookings/ref/{ref}` | Get booking by reference | None |
| `GET` | `/api/bookings/by-email` | Get bookings for guest email | `?email=...` |
| `POST` | `/api/bookings/{id}/cancel`| Cancel eligible reservation | None |

### Demo Payments
| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/payments` | Process simulated demo payment | `{ "bookingId", "amount", "paymentMethod", "payerDetails", "simulateFailure" }` |
| `GET` | `/api/payments/booking/{id}` | Get payment by booking ID | None |
| `GET` | `/api/payments` | All transaction records (Admin) | None |

### Front Desk Check-In & Check-Out
| Method | Endpoint | Description | Request Body |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/check-in` | Check in guest & mark room OCCUPIED | `{ "bookingId", "staffName", "notes" }` |
| `POST` | `/api/check-out` | Check out guest & release room to AVAILABLE | `{ "bookingId", "staffName", "notes" }` |
| `GET` | `/api/check-in-out/{id}` | Audit history for booking | None |

### Invoicing & Admin Analytics
| Method | Endpoint | Description | Notes |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/billing/{bookingId}` | Generate & retrieve itemized bill | Returns tariff, GST, total |
| `GET` | `/api/billing/invoice/{no}` | Retrieve bill by invoice # | e.g. `INV-2026-7334` |
| `GET` | `/api/admin/dashboard/stats` | Aggregated hotel KPIs | Rooms, occupancy, bookings, revenue |

---

## 🗄️ 8. MySQL Database Configuration

1. Create database:
   ```sql
   CREATE DATABASE hotel_management;
   ```
2. Configure credentials in `.env` or `application-mysql.properties`:
   ```properties
   spring.datasource.url=jdbc:mysql://localhost:3306/hotel_management?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC&allowPublicKeyRetrieval=true
   spring.datasource.username=root
   spring.datasource.password=your_password
   ```
3. Run the application! Hibernate and `DatabaseInitializer` will construct the database tables and populate standard data.

---

## 💻 9. Running in Visual Studio Code

1. Open the project root `HotelManagement` in VS Code (`File -> Open Folder...`).
2. Recommended VS Code Extensions:
   - **Extension Pack for Java** (Microsoft)
   - **Spring Boot Extension Pack** (VMware)
   - **ES7+ React/Redux/React-Native snippets**
3. Open two integrated terminals (`Ctrl + ` `):
   - Terminal 1: `cd backend; mvn spring-boot:run`
   - Terminal 2: `cd frontend; npm run dev`
4. Access the web app at `http://localhost:3000`.

---

## ☁️ 10. Cloud Deployment Guide

### Deploy Backend:
- **Docker**: Build Dockerfile with `eclipse-temurin:17-jdk` and deploy to AWS ECS, Railway, or Render.
- Set environment variables on the cloud host: `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`.

### Deploy Frontend:
- **Vercel / Netlify**: Connect the GitHub repository, set Root Directory to `frontend`, Build Command to `npm run build`, and Output Directory to `dist`.
- Set Environment Variable: `VITE_API_BASE_URL` pointing to your deployed backend URL.

---

## 🎓 11. Final-Year Viva Demonstration Guide

When presenting to your project examiner or professor, follow this 5-minute workflow:

1. **Brand Showcase (1 min)**:
   - Show the **Home Page**: Explain the luxury design, Velvet Crown crest, and room categories.
   - Show the **Rooms Page**: Filter by Deluxe/Luxury, click "View Details" to show the modal with amenities.
2. **Guest Booking Workflow (1.5 min)**:
   - Click "Book Stay", select dates (e.g. 3 nights), show automatic calculation: **Tariff × Nights + 12% GST**.
   - Show **Double-Booking Prevention**: Attempting to book the same room on overlapping dates triggers an immediate HTTP 409 Conflict with descriptive feedback.
3. **Simulated Payment Gateway (1 min)**:
   - Select **UPI Demo** (showing generated QR code) or **Card Demo**.
   - Demonstrate the **Simulate Failure Toggle**: Check the box and attempt payment to show custom error handling without crashing.
   - Uncheck the box, complete payment, and show the official **Payment Receipt** with transaction reference.
   - Show the **Duplicate Payment Prevention**: Attempting to pay twice for the same booking is blocked.
4. **Front Desk Operations (1 min)**:
   - Go to **Staff Check-In**: Check in the guest, observe room status becoming **`OCCUPIED`**.
   - Go to **Billing**: Show the printable **Tax Invoice** with itemized room charges and GST.
   - Go to **Staff Check-Out**: Complete departure, show room status automatically updating back to **`AVAILABLE`**.
5. **Admin Dashboard (30 sec)**:
   - Open `/admin`: Show real-time KPI metrics updating instantly (Total Rooms, Available, Occupied, Bookings count, Total Revenue in ₹, and Payment Audit Log).
