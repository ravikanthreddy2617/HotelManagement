package com.velvetcrown.hotel.service;

import com.velvetcrown.hotel.dto.DashboardStatsDTO;
import com.velvetcrown.hotel.repository.BookingRepository;
import com.velvetcrown.hotel.repository.PaymentRepository;
import com.velvetcrown.hotel.repository.RoomRepository;
import com.velvetcrown.hotel.repository.UserRepository;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;

@Service
public class AdminDashboardService {

    private final RoomRepository roomRepository;
    private final BookingRepository bookingRepository;
    private final PaymentRepository paymentRepository;
    private final UserRepository userRepository;

    public AdminDashboardService(RoomRepository roomRepository,
                                 BookingRepository bookingRepository,
                                 PaymentRepository paymentRepository,
                                 UserRepository userRepository) {
        this.roomRepository = roomRepository;
        this.bookingRepository = bookingRepository;
        this.paymentRepository = paymentRepository;
        this.userRepository = userRepository;
    }

    public DashboardStatsDTO getDashboardStats() {
        DashboardStatsDTO stats = new DashboardStatsDTO();

        // Room statistics
        stats.setTotalRooms(roomRepository.count());
        stats.setAvailableRooms(roomRepository.countByStatus("AVAILABLE"));
        stats.setOccupiedRooms(roomRepository.countByStatus("OCCUPIED"));
        stats.setMaintenanceRooms(roomRepository.countByStatus("MAINTENANCE"));

        // Booking statistics
        stats.setTotalBookings(bookingRepository.count());
        stats.setConfirmedBookings(bookingRepository.countByStatus("CONFIRMED"));
        stats.setCheckedInBookings(bookingRepository.countByStatus("CHECKED_IN"));
        stats.setCheckedOutBookings(bookingRepository.countByStatus("CHECKED_OUT"));
        stats.setCancelledBookings(bookingRepository.countByStatus("CANCELLED"));

        // Revenue from recorded payments
        BigDecimal revenue = paymentRepository.calculateTotalRevenue();
        stats.setTotalRevenue(revenue != null ? revenue : BigDecimal.ZERO);

        // Registered guests
        stats.setTotalGuests(userRepository.count());

        return stats;
    }
}
