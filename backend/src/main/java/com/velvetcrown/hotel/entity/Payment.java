package com.velvetcrown.hotel.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "payments")
public class Payment {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "transaction_reference", nullable = false, unique = true, length = 50)
    private String transactionReference;

    @OneToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "booking_id", nullable = false, unique = true)
    private Booking booking;

    @NotNull(message = "Amount is required")
    @DecimalMin(value = "0.0", inclusive = false)
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal amount;

    @NotBlank(message = "Payment method is required")
    @Column(name = "payment_method", nullable = false, length = 50)
    private String paymentMethod; // CASH_DEMO, UPI_DEMO, CARD_DEMO

    @Column(nullable = false, length = 30)
    private String status = "SUCCESSFUL"; // PENDING, SUCCESSFUL, FAILED

    @Column(name = "payer_details", length = 255)
    private String payerDetails;

    @Column(name = "payment_date", updatable = false)
    private LocalDateTime paymentDate = LocalDateTime.now();

    public Payment() {
    }

    public Payment(String transactionReference, Booking booking, BigDecimal amount, String paymentMethod, String status, String payerDetails) {
        this.transactionReference = transactionReference;
        this.booking = booking;
        this.amount = amount;
        this.paymentMethod = paymentMethod;
        this.status = status != null ? status : "SUCCESSFUL";
        this.payerDetails = payerDetails;
        this.paymentDate = LocalDateTime.now();
    }

    @PrePersist
    protected void onCreate() {
        if (this.paymentDate == null) {
            this.paymentDate = LocalDateTime.now();
        }
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTransactionReference() {
        return transactionReference;
    }

    public void setTransactionReference(String transactionReference) {
        this.transactionReference = transactionReference;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public BigDecimal getAmount() {
        return amount;
    }

    public void setAmount(BigDecimal amount) {
        this.amount = amount;
    }

    public String getPaymentMethod() {
        return paymentMethod;
    }

    public void setPaymentMethod(String paymentMethod) {
        this.paymentMethod = paymentMethod;
    }

    public String getStatus() {
        return status;
    }

    public void setStatus(String status) {
        this.status = status;
    }

    public String getPayerDetails() {
        return payerDetails;
    }

    public void setPayerDetails(String payerDetails) {
        this.payerDetails = payerDetails;
    }

    public LocalDateTime getPaymentDate() {
        return paymentDate;
    }

    public void setPaymentDate(LocalDateTime paymentDate) {
        this.paymentDate = paymentDate;
    }
}
