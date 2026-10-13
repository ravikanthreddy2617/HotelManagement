package com.velvetcrown.hotel.service;

import com.velvetcrown.hotel.dto.CheckInRequest;
import com.velvetcrown.hotel.dto.CheckOutRequest;
import com.velvetcrown.hotel.entity.Booking;
import com.velvetcrown.hotel.entity.CheckInOutRecord;
import com.velvetcrown.hotel.entity.Room;
import com.velvetcrown.hotel.exception.BadRequestException;
import com.velvetcrown.hotel.exception.ResourceNotFoundException;
import com.velvetcrown.hotel.repository.BookingRepository;
import com.velvetcrown.hotel.repository.CheckInOutRepository;
import com.velvetcrown.hotel.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class CheckInOutService {

    private final BookingRepository bookingRepository;
    private final RoomRepository roomRepository;
    private final CheckInOutRepository checkInOutRepository;

    public CheckInOutService(BookingRepository bookingRepository, 
                             RoomRepository roomRepository, 
                             CheckInOutRepository checkInOutRepository) {
        this.bookingRepository = bookingRepository;
        this.roomRepository = roomRepository;
        this.checkInOutRepository = checkInOutRepository;
    }

    @Transactional
    public Booking checkInGuest(CheckInRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + request.getBookingId()));

        if ("CANCELLED".equalsIgnoreCase(booking.getStatus())) {
            throw new BadRequestException("Cannot check in a cancelled booking");
        }

        if ("CHECKED_IN".equalsIgnoreCase(booking.getStatus())) {
            throw new BadRequestException("Guest is already checked in for this booking");
        }

        if ("CHECKED_OUT".equalsIgnoreCase(booking.getStatus())) {
            throw new BadRequestException("Guest has already checked out for this booking");
        }

        Room room = booking.getRoom();
        room.setStatus("OCCUPIED");
        roomRepository.save(room);

        booking.setStatus("CHECKED_IN");
        Booking savedBooking = bookingRepository.save(booking);

        // Record check-in audit
        CheckInOutRecord record = new CheckInOutRecord();
        record.setBooking(savedBooking);
        record.setCheckedInAt(LocalDateTime.now());
        record.setCheckedInBy(request.getStaffName() != null ? request.getStaffName() : "Front Desk Staff");
        record.setNotes(request.getNotes());
        checkInOutRepository.save(record);

        return savedBooking;
    }

    @Transactional
    public Booking checkOutGuest(CheckOutRequest request) {
        Booking booking = bookingRepository.findById(request.getBookingId())
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found with ID: " + request.getBookingId()));

        if (!"CHECKED_IN".equalsIgnoreCase(booking.getStatus())) {
            throw new BadRequestException("Only checked-in guests can be checked out. Current status: " + booking.getStatus());
        }

        Room room = booking.getRoom();
        // Room status updated to AVAILABLE upon check-out
        room.setStatus("AVAILABLE");
        roomRepository.save(room);

        booking.setStatus("CHECKED_OUT");
        Booking savedBooking = bookingRepository.save(booking);

        // Record check-out audit
        List<CheckInOutRecord> records = checkInOutRepository.findByBookingIdOrderByCheckedInAtDesc(booking.getId());
        if (!records.isEmpty()) {
            CheckInOutRecord record = records.get(0);
            record.setCheckedOutAt(LocalDateTime.now());
            record.setCheckedOutBy(request.getStaffName() != null ? request.getStaffName() : "Front Desk Staff");
            if (request.getNotes() != null && !request.getNotes().isBlank()) {
                record.setNotes((record.getNotes() != null ? record.getNotes() + " | " : "") + request.getNotes());
            }
            checkInOutRepository.save(record);
        } else {
            CheckInOutRecord newRecord = new CheckInOutRecord();
            newRecord.setBooking(savedBooking);
            newRecord.setCheckedOutAt(LocalDateTime.now());
            newRecord.setCheckedOutBy(request.getStaffName() != null ? request.getStaffName() : "Front Desk Staff");
            newRecord.setNotes(request.getNotes());
            checkInOutRepository.save(newRecord);
        }

        return savedBooking;
    }

    public List<CheckInOutRecord> getAuditRecords(Long bookingId) {
        return checkInOutRepository.findByBookingIdOrderByCheckedInAtDesc(bookingId);
    }
}
