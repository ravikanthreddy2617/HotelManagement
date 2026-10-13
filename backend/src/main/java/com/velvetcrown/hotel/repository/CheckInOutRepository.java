package com.velvetcrown.hotel.repository;

import com.velvetcrown.hotel.entity.CheckInOutRecord;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface CheckInOutRepository extends JpaRepository<CheckInOutRecord, Long> {
    List<CheckInOutRecord> findByBookingIdOrderByCheckedInAtDesc(Long bookingId);
}
