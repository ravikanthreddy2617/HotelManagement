package com.velvetcrown.hotel.config;

import com.velvetcrown.hotel.entity.*;
import com.velvetcrown.hotel.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.time.LocalDateTime;

@Component
public class DatabaseInitializer implements CommandLineRunner {

    private final UserRepository userRepository;
    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final BillRepository billRepository;
    private final PasswordEncoder passwordEncoder;

    public DatabaseInitializer(UserRepository userRepository, 
                               RoomRepository roomRepository, 
                               BookingRepository bookingRepository,
                               PaymentRepository paymentRepository,
                               BillRepository billRepository,
                               PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.billRepository = billRepository;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) throws Exception {
        seedUsers();
        seedRooms();
        seedInitialBookingsAndPayments();
    }

    private void seedUsers() {
        if (!userRepository.existsByEmail("admin@velvetcrown.com")) {
            User admin = new User(
                    "Hotel Administrator",
                    "admin@velvetcrown.com",
                    passwordEncoder.encode("admin123"),
                    "+91 98765 43210",
                    "ROLE_ADMIN"
            );
            userRepository.save(admin);
        }

        if (!userRepository.existsByEmail("guest@velvetcrown.com")) {
            User guest = new User(
                    "Arya Sharma",
                    "guest@velvetcrown.com",
                    passwordEncoder.encode("guest123"),
                    "+91 98123 45678",
                    "ROLE_GUEST"
            );
            userRepository.save(guest);
        }
    }

    private void seedRooms() {
        if (roomRepository.count() == 0) {
            // Standard Rooms: ₹2,500
            roomRepository.save(new Room("101", "STANDARD", BigDecimal.valueOf(2500.00), 2, "AVAILABLE",
                    "Cozy and serene room with a queen bed, warm ambient lighting, marble work desk, and courtyard views.",
                    "https://images.unsplash.com/photo-1611892440504-42a792e24d32?auto=format&fit=crop&w=800&q=80",
                    "High-speed Wi-Fi, King Bed, Smart LED TV, Coffee Maker, Luxury Toiletries"));

            roomRepository.save(new Room("102", "STANDARD", BigDecimal.valueOf(2500.00), 2, "AVAILABLE",
                    "Quiet elegance featuring crisp linen, soundproof glazing, rainfall shower, and ergonomic seating.",
                    "https://images.unsplash.com/photo-1590490360182-c33d57733427?auto=format&fit=crop&w=800&q=80",
                    "High-speed Wi-Fi, Queen Bed, Smart LED TV, Room Service, En-suite Bath"));

            roomRepository.save(new Room("103", "STANDARD", BigDecimal.valueOf(2500.00), 2, "AVAILABLE",
                    "Charming contemporary space designed for solo travelers or couples, with complimentary breakfast.",
                    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
                    "High-speed Wi-Fi, Queen Bed, Air Conditioning, Safe Locker, Work Desk"));

            roomRepository.save(new Room("104", "STANDARD", BigDecimal.valueOf(2500.00), 2, "AVAILABLE",
                    "Refined city-facing retreat with warm wood accents and bespoke velvet upholstery.",
                    "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?auto=format&fit=crop&w=800&q=80",
                    "High-speed Wi-Fi, Queen Bed, Smart TV, Mini Fridge, Kettle"));

            // Deluxe Rooms: ₹3,500
            roomRepository.save(new Room("201", "DELUXE", BigDecimal.valueOf(3500.00), 3, "AVAILABLE",
                    "Spacious deluxe sanctuary offering skyline vistas, plush lounge seating, and an Italian marble bathroom.",
                    "https://images.unsplash.com/photo-1591088398332-8a7791972843?auto=format&fit=crop&w=800&q=80",
                    "Balcony View, King Bed, 55-inch OLED TV, Mini Bar, Espresso Machine, Rain Shower"));

            roomRepository.save(new Room("202", "DELUXE", BigDecimal.valueOf(3500.00), 3, "AVAILABLE",
                    "Bright corner suite with panoramic windows, walk-in dressing area, and handcrafted king-size bed.",
                    "https://images.unsplash.com/photo-1618773928121-c32242e63f39?auto=format&fit=crop&w=800&q=80",
                    "Panoramic View, King Bed, Mini Bar, Bathrobe & Slippers, Room Dining"));

            roomRepository.save(new Room("203", "DELUXE", BigDecimal.valueOf(3500.00), 3, "AVAILABLE",
                    "Elegantly proportioned room with private balcony, designer velvet chaise, and ambient sound system.",
                    "https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=800&q=80",
                    "Private Balcony, King Bed, High-speed Wi-Fi, Bathtub, Gourmet Minibar"));

            roomRepository.save(new Room("204", "DELUXE", BigDecimal.valueOf(3500.00), 3, "AVAILABLE",
                    "Modern opulence with velvet headboards, separate vanity station, and premium botanical amenities.",
                    "https://images.unsplash.com/photo-1578683010236-d716f9a3f461?auto=format&fit=crop&w=800&q=80",
                    "Garden View, King Bed, Soundproof, Smart Climate Control, Luxury Linen"));

            // Luxury Rooms: ₹5,000
            roomRepository.save(new Room("301", "LUXURY", BigDecimal.valueOf(5000.00), 4, "AVAILABLE",
                    "The Velvet Royal Suite: Jacuzzi tub, private butler service, panoramic ocean view, and champagne lounge.",
                    "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?auto=format&fit=crop&w=800&q=80",
                    "Ocean View, Private Jacuzzi, Butler Service, King Bed, Dining Area, 65-inch OLED"));

            roomRepository.save(new Room("302", "LUXURY", BigDecimal.valueOf(5000.00), 4, "AVAILABLE",
                    "Presidential Crown Suite featuring separate living pavilion, private bar, freestanding tub, and sunset terrace.",
                    "https://images.unsplash.com/photo-1582719508461-905c673771fd?auto=format&fit=crop&w=800&q=80",
                    "Sunset Terrace, Jacuzzi, Chauffeur Service, Walk-in Closet, Premium Wine Cellar"));

            roomRepository.save(new Room("303", "LUXURY", BigDecimal.valueOf(5000.00), 4, "AVAILABLE",
                    "Aristocratic penthouse suite crowned with gold gilded chandeliers, deep soaking tub, and bespoke artwork.",
                    "https://images.unsplash.com/photo-1590490359683-658d3d23f972?auto=format&fit=crop&w=800&q=80",
                    "Penthouse Terrace, Deep Soaking Tub, Executive Lounge Access, 24/7 Butler"));

            roomRepository.save(new Room("304", "LUXURY", BigDecimal.valueOf(5000.00), 4, "AVAILABLE",
                    "Opulent sanctuary featuring plush velvet draperies, king featherbed, and dual marble vanity.",
                    "https://images.unsplash.com/photo-1566665797739-1674de7a421a?auto=format&fit=crop&w=800&q=80",
                    "City Panoramic View, Jacuzzi, Personal Concierge, Soundproof, Luxury Bar"));
        }
    }

    private void seedInitialBookingsAndPayments() {
        if (bookingRepository.count() == 0) {
            Room deluxeRoom = roomRepository.findByRoomNumber("201").orElse(null);
            User guest = userRepository.findByEmail("guest@velvetcrown.com").orElse(null);

            if (deluxeRoom != null && guest != null) {
                Booking sampleBooking = new Booking();
                sampleBooking.setBookingReference("VC-2026-8842");
                sampleBooking.setUser(guest);
                sampleBooking.setRoom(deluxeRoom);
                sampleBooking.setGuestName("Arya Sharma");
                sampleBooking.setGuestEmail("guest@velvetcrown.com");
                sampleBooking.setGuestPhone("+91 98123 45678");
                sampleBooking.setCheckInDate(LocalDate.now().plusDays(2));
                sampleBooking.setCheckOutDate(LocalDate.now().plusDays(5));
                sampleBooking.setTotalNights(3);
                sampleBooking.setTotalPrice(BigDecimal.valueOf(10500.00));
                sampleBooking.setSpecialRequests("High floor, late check-in request at 4 PM.");
                sampleBooking.setStatus("CONFIRMED");

                Booking saved = bookingRepository.save(sampleBooking);

                // Create initial demo payment
                Payment payment = new Payment();
                payment.setTransactionReference("TXN-UPI-984210");
                payment.setBooking(saved);
                payment.setAmount(BigDecimal.valueOf(11760.00)); // With 12% GST
                payment.setPaymentMethod("UPI_DEMO");
                payment.setStatus("SUCCESSFUL");
                payment.setPayerDetails("UPI ID: arya@okhdfcbank");
                paymentRepository.save(payment);

                // Create Bill
                Bill bill = new Bill();
                bill.setInvoiceNumber("INV-2026-8842");
                bill.setBooking(saved);
                bill.setRoomCharges(BigDecimal.valueOf(10500.00));
                bill.setTaxAmount(BigDecimal.valueOf(1260.00));
                bill.setDiscountAmount(BigDecimal.ZERO);
                bill.setTotalAmount(BigDecimal.valueOf(11760.00));
                bill.setStatus("PAID");
                billRepository.save(bill);
            }
        }
    }
}
