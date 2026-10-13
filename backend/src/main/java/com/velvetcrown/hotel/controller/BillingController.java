package com.velvetcrown.hotel.controller;

import com.velvetcrown.hotel.dto.ApiResponse;
import com.velvetcrown.hotel.entity.Bill;
import com.velvetcrown.hotel.service.BillingService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/billing")
@CrossOrigin(origins = {"http://localhost:3000", "http://localhost:5173", "http://127.0.0.1:3000", "http://127.0.0.1:5173"})
public class BillingController {

    private final BillingService billingService;

    public BillingController(BillingService billingService) {
        this.billingService = billingService;
    }

    @GetMapping("/{bookingId}")
    public ResponseEntity<ApiResponse<Bill>> getBill(@PathVariable Long bookingId) {
        Bill bill = billingService.getBillByBookingId(bookingId);
        return ResponseEntity.ok(ApiResponse.ok("Invoice retrieved successfully", bill));
    }

    @GetMapping("/invoice/{invoiceNumber}")
    public ResponseEntity<ApiResponse<Bill>> getBillByInvoiceNumber(@PathVariable String invoiceNumber) {
        Bill bill = billingService.getBillByInvoiceNumber(invoiceNumber);
        return ResponseEntity.ok(ApiResponse.ok("Invoice retrieved successfully", bill));
    }
}
