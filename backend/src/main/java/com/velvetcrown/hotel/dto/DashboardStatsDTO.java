package com.velvetcrown.hotel.dto;

import java.math.BigDecimal;

public class DashboardStatsDTO {

    private long totalRooms;
    private long availableRooms;
    private long occupiedRooms;
    private long maintenanceRooms;

    private long totalBookings;
    private long confirmedBookings;
    private long checkedInBookings;
    private long checkedOutBookings;
    private long cancelledBookings;

    private BigDecimal totalRevenue;
    private long totalGuests;

    public DashboardStatsDTO() {
    }

    public long getTotalRooms() {
        return totalRooms;
    }

    public void setTotalRooms(long totalRooms) {
        this.totalRooms = totalRooms;
    }

    public long getAvailableRooms() {
        return availableRooms;
    }

    public void setAvailableRooms(long availableRooms) {
        this.availableRooms = availableRooms;
    }

    public long getOccupiedRooms() {
        return occupiedRooms;
    }

    public void setOccupiedRooms(long occupiedRooms) {
        this.occupiedRooms = occupiedRooms;
    }

    public long getMaintenanceRooms() {
        return maintenanceRooms;
    }

    public void setMaintenanceRooms(long maintenanceRooms) {
        this.maintenanceRooms = maintenanceRooms;
    }

    public long getTotalBookings() {
        return totalBookings;
    }

    public void setTotalBookings(long totalBookings) {
        this.totalBookings = totalBookings;
    }

    public long getConfirmedBookings() {
        return confirmedBookings;
    }

    public void setConfirmedBookings(long confirmedBookings) {
        this.confirmedBookings = confirmedBookings;
    }

    public long getCheckedInBookings() {
        return checkedInBookings;
    }

    public void setCheckedInBookings(long checkedInBookings) {
        this.checkedInBookings = checkedInBookings;
    }

    public long getCheckedOutBookings() {
        return checkedOutBookings;
    }

    public void setCheckedOutBookings(long checkedOutBookings) {
        this.checkedOutBookings = checkedOutBookings;
    }

    public long getCancelledBookings() {
        return cancelledBookings;
    }

    public void setCancelledBookings(long cancelledBookings) {
        this.cancelledBookings = cancelledBookings;
    }

    public BigDecimal getTotalRevenue() {
        return totalRevenue;
    }

    public void setTotalRevenue(BigDecimal totalRevenue) {
        this.totalRevenue = totalRevenue;
    }

    public long getTotalGuests() {
        return totalGuests;
    }

    public void setTotalGuests(long totalGuests) {
        this.totalGuests = totalGuests;
    }
}
