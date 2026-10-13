package com.velvetcrown.hotel.dto;

import jakarta.validation.constraints.NotNull;

public class CheckOutRequest {

    @NotNull(message = "Booking ID is required")
    private Long bookingId;

    private String staffName;
    private String notes;

    public CheckOutRequest() {
    }

    public Long getBookingId() {
        return bookingId;
    }

    public void setBookingId(Long bookingId) {
        this.bookingId = bookingId;
    }

    public String getStaffName() {
        return staffName;
    }

    public void setStaffName(String staffName) {
        this.staffName = staffName;
    }

    public String getNotes() {
        return notes;
    }

    public void setNotes(String notes) {
        this.notes = notes;
    }
}
