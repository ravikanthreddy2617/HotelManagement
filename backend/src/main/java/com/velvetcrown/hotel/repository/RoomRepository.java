package com.velvetcrown.hotel.repository;

import com.velvetcrown.hotel.entity.Room;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    Optional<Room> findByRoomNumber(String roomNumber);

    boolean existsByRoomNumber(String roomNumber);

    List<Room> findByRoomTypeIgnoreCase(String roomType);

    List<Room> findByStatus(String status);

    long countByStatus(String status);

    // Find all rooms that do NOT have any overlapping active bookings for the specified dates
    @Query("SELECT r FROM Room r WHERE r.status != 'MAINTENANCE' AND r.id NOT IN (" +
           "  SELECT b.room.id FROM Booking b " +
           "  WHERE b.status IN ('CONFIRMED', 'CHECKED_IN') " +
           "  AND b.checkInDate < :checkOutDate " +
           "  AND b.checkOutDate > :checkInDate" +
           ")")
    List<Room> findAvailableRoomsForDates(@Param("checkInDate") LocalDate checkInDate, 
                                          @Param("checkOutDate") LocalDate checkOutDate);

    // Find available rooms filtered by roomType
    @Query("SELECT r FROM Room r WHERE r.status != 'MAINTENANCE' " +
           "AND UPPER(r.roomType) = UPPER(:roomType) " +
           "AND r.id NOT IN (" +
           "  SELECT b.room.id FROM Booking b " +
           "  WHERE b.status IN ('CONFIRMED', 'CHECKED_IN') " +
           "  AND b.checkInDate < :checkOutDate " +
           "  AND b.checkOutDate > :checkInDate" +
           ")")
    List<Room> findAvailableRoomsForDatesAndType(@Param("roomType") String roomType,
                                                @Param("checkInDate") LocalDate checkInDate, 
                                                @Param("checkOutDate") LocalDate checkOutDate);
}
