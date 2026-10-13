package com.velvetcrown.hotel.service;

import com.velvetcrown.hotel.entity.Bill;
import com.velvetcrown.hotel.entity.Booking;
import com.velvetcrown.hotel.exception.ResourceNotFoundException;
import com.velvetcrown.hotel.repository.BillRepository;
import com.velvetcrown.hotel.repository.BookingRepository;
import com.velvetcrown.hotel.repository.PaymentRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.Optional;

@Service
public class BillingService {

    private final BillRepository billRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;

    public BillingService(BillRepository billRepository, 
                          BookingRepository bookingRepository,
                          PaymentRepository paymentRepository) {
        this.billRepository = billRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
    }

    public Bill getBillByBookingId(Long bookingId) {
        Optional<Bill> billOpt = billRepository.findByBookingId(bookingId);
        if (billOpt.isPresent()) {
            Bill bill = billOpt.get();
            // Sync status with payment
            boolean isPaid = paymentRepository.existsByBookingIdAndStatus(bookingId, "SUCCESSFUL");
            if (isPaid && !"PAID".equalsIgnoreCase(bill.getStatus())) {
                bill.setStatus("PAID");
                billRepository.save(bill);
            }
            return bill;
        }

        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + bookingId));

        return generateBillForBooking(booking);
    }

    public Bill getBillByInvoiceNumber(String invoiceNumber) {
        return billRepository.findByInvoiceNumber(invoiceNumber.trim())
                .orElseThrow(() -> new ResourceNotFoundException("Bill not found with invoice number: " + invoiceNumber));
    }

    @Transactional
    public Bill generateBillForBooking(Booking booking) {
        BigDecimal roomCharges = booking.getTotalPrice();
        BigDecimal taxAmount = roomCharges.multiply(BigDecimal.valueOf(0.12)).setScale(2, RoundingMode.HALF_UP);
        BigDecimal totalAmount = roomCharges.add(taxAmount);

        boolean isPaid = paymentRepository.existsByBookingIdAndStatus(booking.getId(), "SUCCESSFUL");

        Bill bill = new Bill();
        bill.setInvoiceNumber("INV-" + booking.getBookingReference().replace("VC-", ""));
        bill.setBooking(booking);
        bill.setRoomCharges(roomCharges);
        bill.setTaxAmount(taxAmount);
        bill.setDiscountAmount(BigDecimal.ZERO);
        bill.setTotalAmount(totalAmount);
        bill.setStatus(isPaid ? "PAID" : "PENDING");

        return billRepository.save(bill);
    }
}
