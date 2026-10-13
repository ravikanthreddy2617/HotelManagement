package com.velvetcrown.hotel.service;

import com.velvetcrown.hotel.dto.BookingRequest;
import com.velvetcrown.hotel.entity.Bill;
import com.velvetcrown.hotel.entity.Booking;
import com.velvetcrown.hotel.entity.Room;
import com.velvetcrown.hotel.entity.User;
import com.velvetcrown.hotel.exception.BadRequestException;
import com.velvetcrown.hotel.exception.ResourceNotFoundException;
import com.velvetcrown.hotel.exception.RoomNotAvailableException;
import com.velvetcrown.hotel.repository.BillRepository;
import com.velvetcrown.hotel.repository.BookingRepository;
import com.velvetcrown.hotel.repository.RoomRepository;
import com.velvetcrown.hotel.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.security.SecureRandom;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;
import java.util.List;

@Service
public class BookingService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final UserRepository userRepository;
    private final BillRepository billRepository;
    private final SecureRandom random = new SecureRandom();

    public BookingService(BookingRepository bookingRepository, 
                          RoomRepository roomRepository, 
                          UserRepository userRepository,
                          BillRepository billRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.userRepository = userRepository;
        this.billRepository = billRepository;
    }

    @Transactional
    public Booking createBooking(BookingRequest request) {
        LocalDate checkIn = request.getCheckInDate();
        LocalDate checkOut = request.getCheckOutDate();

        if (checkIn == null || checkOut == null) {
            throw new BadRequestException("Check-in and check-out dates are required");
        }

        if (checkIn.isBefore(LocalDate.now())) {
            throw new BadRequestException("Check-in date cannot be in the past");
        }

        if (checkOut.isBefore(checkIn) || checkOut.isEqual(checkIn)) {
            throw new BadRequestException("Check-out date must be strictly after check-in date");
        }

        long nightsBetween = ChronoUnit.DAYS.between(checkIn, checkOut);
        if (nightsBetween < 1) {
            throw new BadRequestException("Minimum stay is 1 night");
        }
        int totalNights = (int) nightsBetween;

        Room room = roomRepository.findById(request.getRoomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + request.getRoomId()));

        if ("MAINTENANCE".equalsIgnoreCase(room.getStatus())) {
            throw new RoomNotAvailableException("Room " + room.getRoomNumber() + " is currently under maintenance");
        }

        // Prevent double booking: check if room is already booked for these overlapping dates
        List<Booking> overlapping = bookingRepository.findOverlappingBookings(room.getId(), checkIn, checkOut);
        if (!overlapping.isEmpty()) {
            throw new RoomNotAvailableException("Room " + room.getRoomNumber() + 
                    " is already booked for the selected dates (" + checkIn + " to " + checkOut + "). Please choose other dates or another room.");
        }

        // Calculate total price: number of nights multiplied by the room price
        BigDecimal totalPrice = room.getPricePerNight().multiply(BigDecimal.valueOf(totalNights));

        User user = null;
        if (request.getUserId() != null) {
            user = userRepository.findById(request.getUserId()).orElse(null);
        }

        Booking booking = new Booking();
        booking.setBookingReference(generateBookingReference());
        booking.setUser(user);
        booking.setRoom(room);
        booking.setGuestName(request.getGuestName().trim());
        booking.setGuestEmail(request.getGuestEmail().toLowerCase().trim());
        booking.setGuestPhone(request.getGuestPhone().trim());
        booking.setCheckInDate(checkIn);
        booking.setCheckOutDate(checkOut);
        booking.setTotalNights(totalNights);
        booking.setTotalPrice(totalPrice);
        booking.setSpecialRequests(request.getSpecialRequests());
        booking.setStatus("CONFIRMED");

        Booking savedBooking = bookingRepository.save(booking);

        // Auto-generate Bill record
        generateInitialBill(savedBooking);

        return savedBooking;
    }

    public Booking getBookingById(Long id) {
        return bookingRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + id));
    }

    public Booking getBookingByReference(String reference) {
        return bookingRepository.findByBookingReference(reference.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with reference: " + reference));
    }

    public List<Booking> getBookingsByUser(Long userId) {
        return bookingRepository.findByUserIdOrderByCreatedAtDesc(userId);
    }

    public List<Booking> getBookingsByEmail(String email) {
        return bookingRepository.findByGuestEmailIgnoreCaseOrderByCreatedAtDesc(email.trim());
    }

    public List<Booking> getAllBookings() {
        return bookingRepository.findAllByOrderByCreatedAtDesc();
    }

    public List<Booking> getBookingsByStatus(String status) {
        return bookingRepository.findByStatusOrderByCreatedAtDesc(status.toUpperCase().trim());
    }

    @Transactional
    public Booking cancelBooking(Long id) {
        Booking booking = getBookingById(id);

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new BadRequestException("Booking is already cancelled");
        }

        if ("CHECKED_OUT".equalsIgnoreCase(booking.getStatus())) {
            throw new BadRequestException("Cannot cancel a completed stay");
        }

        booking.setStatus("CANCELLED");
        // If room was marked OCCUPIED for this booking, release it
        if ("OCCUPIED".equalsIgnoreCase(booking.getRoom().getStatus())) {
            booking.getRoom().setStatus("AVAILABLE");
            roomRepository.save(booking.getRoom());
        }

        return bookingRepository.save(booking);
    }

    private String generateBookingReference() {
        int randomCode = 1000 + random.nextInt(9000);
        return "VC-" + LocalDate.now().getYear() + "-" + randomCode;
    }

    private void generateInitialBill(Booking booking) {
        // Room charges
        BigDecimal roomCharges = booking.getTotalPrice();
        // 12% GST luxury hotel tax
        BigDecimal taxAmount = roomCharges.multiply(BigDecimal.valueOf(0.12)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = roomCharges.add(taxAmount);

        Bill bill = new Bill();
        bill.setInvoiceNumber("INV-" + booking.getBookingReference().replace("VC-", ""));
        bill.setBooking(booking);
        bill.setRoomCharges(roomCharges);
        bill.setTaxAmount(taxAmount);
        bill.setDiscountAmount(BigDecimal.ZERO);
        bill.setTotalAmount(totalAmount);
        bill.setStatus("PENDING");

        billRepository.save(bill);
    }
}
