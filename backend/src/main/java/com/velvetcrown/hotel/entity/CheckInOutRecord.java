package com.velvetcrown.hotel.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "check_in_outs")
public class CheckInOutRecord {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER, optional = false)
    @JoinColumn(name = "booking_id", nullable = false)
    private Booking booking;

    @Column(name = "checked_in_at")
    private LocalDateTime checkedInAt;

    @Column(name = "checked_in_by", length = 100)
    private String checkedInBy;

    @Column(name = "checked_out_at")
    private LocalDateTime checkedOutAt;

    @Column(name = "checked_out_by", length = 100)
    private String checkedOutBy;

    @Column(columnDefinition = "TEXT")
    private String notes;

    public CheckInOutRecord() {
    }

    public CheckInOutRecord(Booking booking, LocalDateTime checkedInAt, String checkedInBy, String notes) {
        this.booking = booking;
        this.checkedInAt = checkedInAt;
        this.checkedInBy = checkedInBy;
        this.notes = notes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Booking getBooking() {
        return booking;
    }

    public void setBooking(Booking booking) {
        this.booking = booking;
    }

    public LocalDateTime getCheckedInAt() {
        return checkedInAt;
    }

    public void setCheckedInAt(LocalDateTime checkedInAt) {
        this.checkedInAt = checkedInAt;
    }

    public String getCheckedInBy() {
        return checkedInBy;
    }

    public void setCheckedInBy(String checkedInBy) {
        this.checkedInBy = checkedInBy;
    }

    public LocalDateTime getCheckedOutAt() {
        return checkedOutAt;
    }

    public void setCheckedOutAt(LocalDateTime checkedOutAt) {
        this.checkedOutAt = checkedOutAt;
    }

    public String getCheckedOutBy() {
        return checkedOutBy;
    }

    public void setCheckedOutBy(String checkedOutBy) {
        this.checkedOutBy = checkedOutBy;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
