package com.velvetcrown.hotel.service;

import com.velvetcrown.hotel.dto.PaymentRequest;
import com.velvetcrown.hotel.entity.Bill;
import com.velvetcrown.hotel.entity.Booking;
import com.velvetcrown.hotel.entity.Payment;
import com.velvetcrown.hotel.exception.BadRequestException;
import com.velvetcrown.hotel.exception.ResourceNotFoundException;
import com.velvetcrown.hotel.repository.BillRepository;
import com.velvetcrown.hotel.repository.BookingRepository;
import com.velvetcrown.hotel.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class PaymentService {

    private final PaymentRepository paymentRepository;
    private final BookingRepository bookingRepository;
    private final BillRepository billRepository;
    private final SecureRandom random = new SecureRandom();

    public PaymentService(PaymentRepository paymentRepository, 
                          BookingRepository bookingRepository,
                          BillRepository billRepository) {
        this.paymentRepository = paymentRepository;
        this.bookingRepository = bookingRepository;
        this.billRepository = billRepository;
    }

    @Transactional
    public Payment processPayment(PaymentRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + request.getBookingId()));

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new BadRequestException("Cannot make a payment for a cancelled booking");
        }

        // Prevent duplicate successful payments for the same booking
        if (paymentRepository.existsByBookingIdAndStatus(booking.getId(), "SUCCESSFUL")) {
            throw new BadRequestException("This booking has already been paid for. Duplicate payment prevented.");
        }

        // Check if user requested simulated failure (for error handling demonstration)
        if (request.isSimulateFailure()) {
            Payment failedPayment = new Payment();
            failedPayment.setTransactionReference("FAIL-" + System.currentTimeMillis() % 100000);
            failedPayment.setBooking(booking);
            failedPayment.setAmount(request.getAmount());
            failedPayment.setPaymentMethod(request.getPaymentMethod().toUpperCase());
            failedPayment.setStatus("FAILED");
            failedPayment.setPayerDetails("Simulated demo transaction failure");
            paymentRepository.save(failedPayment);

            throw new BadRequestException("Simulated Demo Payment Gateway error: Transaction declined. Please try again with valid demo details.");
        }

        // Validate payment method
        String method = request.getPaymentMethod().toUpperCase().trim();
        if (!method.equals("CASH_DEMO") && !method.equals("UPI_DEMO") && !method.equals("CARD_DEMO")) {
            throw new BadRequestException("Invalid payment method. Accepted demo methods: CASH_DEMO, UPI_DEMO, CARD_DEMO");
        }

        Payment payment = new Payment();
        payment.setTransactionReference(generateTransactionReference(method));
        payment.setBooking(booking);
        payment.setAmount(request.getAmount());
        payment.setPaymentMethod(method);
        payment.setStatus("SUCCESSFUL");
        payment.setPayerDetails(request.getPayerDetails() != null ? request.getPayerDetails() : "Guest: " + booking.getGuestName());

        Payment savedPayment = paymentRepository.save(payment);

        // Update bill status to PAID
        Optional<Bill> billOpt = billRepository.findByBookingId(booking.getId());
        if (billOpt.isPresent()) {
            Bill bill = billOpt.get();
            bill.setStatus("PAID");
            billRepository.save(bill);
        }

        return savedPayment;
    }

    public Payment getPaymentByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("No payment record found for booking ID: " + bookingId));
    }

    public Optional<Payment> findPaymentByBookingId(Long bookingId) {
        return paymentRepository.findByBookingId(bookingId);
    }

    public Payment getPaymentByReference(String reference) {
        return paymentRepository.findByTransactionReference(reference.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Payment not found with reference: " + reference));
    }

    public List<Payment> getAllPayments() {
        return paymentRepository.findAllByOrderByPaymentDateDesc();
    }

    public BigDecimal getTotalRevenue() {
        return paymentRepository.calculateTotalRevenue();
    }

    private String generateTransactionReference(String method) {
        String prefix = switch (method) {
            case "UPI_DEMO" -> "TXN-UPI-";
            case "CARD_DEMO" -> "TXN-CRD-";
            case "CASH_DEMO" -> "TXN-CSH-";
            default -> "TXN-DEMO-";
        };
        int randomCode = 100000 + random.nextInt(900000);
        return prefix + System.currentTimeMillis() % 1000000 + "-" + randomCode;
    }
}
