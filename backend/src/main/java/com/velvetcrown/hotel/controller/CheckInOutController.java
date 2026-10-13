package com.velvetcrown.hotel.controller;

import com.velvetcrown.hotel.dto.ApiResponse;
import com.velvetcrown.hotel.dto.CheckInRequest;
import com.velvetcrown.hotel.dto.CheckOutRequest;
import com.velvetcrown.hotel.entity.Booking;
import com.velvetcrown.hotel.entity.CheckInOutRecord;
import com.velvetcrown.hotel.service.CheckInOutService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"})
public class CheckInOutController {

    private final CheckInOutService checkInOutService;

    public CheckInOutController(CheckInOutService checkInOutService) {
        this.checkInOutService = checkInOutService;
    }

    @PostMapping("/check-in")
    public ResponseEntity<ApiResponse<Booking>> checkIn(@Valid @RequestBody CheckInRequest request) {
        Booking booking = checkInOutService.checkInGuest(request);
        return ResponseEntity.ok(ApiResponse.ok("Guest successfully checked in to Room " + booking.getRoom().getRoomNumber(), booking));
    }

    @PostMapping("/check-out")
    public ResponseEntity<ApiResponse<Booking>> checkOut(@Valid @RequestBody CheckOutRequest request) {
        Booking booking = checkInOutService.checkOutGuest(request);
        return ResponseEntity.ok(ApiResponse.ok("Guest successfully checked out. Room " + booking.getRoom().getRoomNumber() + " is now available.", booking));
    }

    @GetMapping("/check-in-out/{bookingId}")
    public ResponseEntity<ApiResponse<List<CheckInOutRecord>>> getAuditRecords(@PathVariable Long bookingId) {
        List<CheckInOutRecord> records = checkInOutService.getAuditRecords(bookingId);
        return ResponseEntity.ok(ApiResponse.ok("Audit records retrieved successfully", records));
    }
}
