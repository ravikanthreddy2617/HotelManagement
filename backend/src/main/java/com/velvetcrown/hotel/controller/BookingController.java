package com.velvetcrown.hotel.controller;

import com.velvetcrown.hotel.dto.ApiResponse;
import com.velvetcrown.hotel.dto.BookingRequest;
import com.velvetcrown.hotel.entity.Booking;
import com.velvetcrown.hotel.service.BookingService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/bookings")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"})
public class BookingController {

    private final BookingService bookingService;

    public BookingController(BookingService bookingService) {
        this.bookingService = bookingService;
    }

    @PostMapping
    public ResponseEntity<ApiResponse<Booking>> createBooking(@Valid @RequestBody BookingRequest request) {
        Booking booking = bookingService.createBooking(request);
        return ResponseEntity.status(HttpStatus.CREATED)
                .body(ApiResponse.ok("Booking confirmed! Reference: " + booking.getBookingReference(), booking));
    }

    @GetMapping
    public ResponseEntity<ApiResponse<List<Booking>>> getAllBookings(
            @RequestParam(required = false) String status) {
        List<Booking> bookings = (status != null && !status.isBlank()) 
                ? bookingService.getBookingsByStatus(status) 
                : bookingService.getAllBookings();
        return ResponseEntity.ok(ApiResponse.ok("Bookings retrieved successfully", bookings));
    }

    @GetMapping("/{id}")
    public ResponseEntity<ApiResponse<Booking>> getBookingById(@PathVariable Long id) {
        Booking booking = bookingService.getBookingById(id);
        return ResponseEntity.ok(ApiResponse.ok("Booking retrieved successfully", booking));
    }

    @GetMapping("/ref/{reference}")
    public ResponseEntity<ApiResponse<Booking>> getBookingByReference(@PathVariable String reference) {
        Booking booking = bookingService.getBookingByReference(reference);
        return ResponseEntity.ok(ApiResponse.ok("Booking retrieved successfully", booking));
    }

    @GetMapping("/user/{userId}")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByUser(@PathVariable Long userId) {
        List<Booking> bookings = bookingService.getBookingsByUser(userId);
        return ResponseEntity.ok(ApiResponse.ok("User bookings retrieved successfully", bookings));
    }

    @GetMapping("/by-email")
    public ResponseEntity<ApiResponse<List<Booking>>> getBookingsByEmail(@RequestParam String email) {
        List<Booking> bookings = bookingService.getBookingsByEmail(email);
        return ResponseEntity.ok(ApiResponse.ok("Guest bookings retrieved successfully", bookings));
    }

    @PostMapping("/{id}/cancel")
    public ResponseEntity<ApiResponse<Booking>> cancelBooking(@PathVariable Long id) {
        Booking booking = bookingService.cancelBooking(id);
        return ResponseEntity.ok(ApiResponse.ok("Booking cancelled successfully", booking));
    }
}
