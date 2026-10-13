package com.velvetcrown.hotel.service;

import com.velvetcrown.hotel.dto.RoomDTO;
import com.velvetcrown.hotel.entity.Room;
import com.velvetcrown.hotel.exception.BadRequestException;
import com.velvetcrown.hotel.exception.ResourceNotFoundException;
import com.velvetcrown.hotel.repository.RoomRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Service
public class RoomService {

    private final RoomRepository roomRepository;

    public RoomService(RoomRepository roomRepository) {
        this.roomRepository = roomRepository;
    }

    public List<Room> getAllRooms() {
        return roomRepository.findAll();
    }

    public Room getRoomById(Long id) {
        return roomRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with ID: " + id));
    }

    public Room getRoomByNumber(String roomNumber) {
        return roomRepository.findByRoomNumber(roomNumber)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found with number: " + roomNumber));
    }

    public List<Room> getAvailableRooms(LocalDate checkInDate, LocalDate checkOutDate, String roomType) {
        if (checkInDate == null || checkOutDate == null) {
            if (roomType != null && !roomType.isBlank() && !roomType.equalsIgnoreCase("ALL")) {
                return roomRepository.findByRoomTypeIgnoreCase(roomType);
            }
            return roomRepository.findAll();
        }

        if (checkInDate.isAfter(checkOutDate) || checkInDate.isEqual(checkOutDate)) {
            throw new BadRequestException("Check-out date must be strictly after check-in date");
        }

        if (roomType != null && !roomType.isBlank() && !roomType.equalsIgnoreCase("ALL")) {
            return roomRepository.findAvailableRoomsForDatesAndType(roomType, checkInDate, checkOutDate);
        } else {
            return roomRepository.findAvailableRoomsForDates(checkInDate, checkOutDate);
        }
    }

    @Transactional
    public Room createRoom(RoomDTO dto) {
        if (roomRepository.existsByRoomNumber(dto.getRoomNumber())) {
            throw new BadRequestException("Room number " + dto.getRoomNumber() + " already exists");
        }

        Room room = new Room();
        room.setRoomNumber(dto.getRoomNumber().trim());
        room.setRoomType(dto.getRoomType().toUpperCase().trim());
        
        // Enforce standard pricing guidelines if not overridden
        BigDecimal price = dto.getPricePerNight();
        if (price == null) {
            price = getDefaultPriceForType(room.getRoomType());
        }
        room.setPricePerNight(price);
        room.setCapacity(dto.getCapacity() != null ? dto.getCapacity() : 2);
        room.setStatus(dto.getStatus() != null ? dto.getStatus().toUpperCase() : "AVAILABLE");
        room.setDescription(dto.getDescription());
        room.setImageUrl(dto.getImageUrl());
        room.setAmenities(dto.getAmenities());

        return roomRepository.save(room);
    }

    @Transactional
    public Room updateRoom(Long id, RoomDTO dto) {
        Room room = getRoomById(id);

        if (!room.getRoomNumber().equalsIgnoreCase(dto.getRoomNumber())) {
            if (roomRepository.existsByRoomNumber(dto.getRoomNumber())) {
                throw new BadRequestException("Room number " + dto.getRoomNumber() + " already exists");
            }
            room.setRoomNumber(dto.getRoomNumber().trim());
        }

        room.setRoomType(dto.getRoomType().toUpperCase().trim());
        room.setPricePerNight(dto.getPricePerNight());
        if (dto.getCapacity() != null) {
            room.setCapacity(dto.getCapacity());
        }
        if (dto.getStatus() != null) {
            room.setStatus(dto.getStatus().toUpperCase().trim());
        }
        room.setDescription(dto.getDescription());
        room.setImageUrl(dto.getImageUrl());
        room.setAmenities(dto.getAmenities());

        return roomRepository.save(room);
    }

    @Transactional
    public void deleteRoom(Long id) {
        Room room = getRoomById(id);
        roomRepository.delete(room);
    }

    @Transactional
    public Room updateRoomStatus(Long id, String status) {
        Room room = getRoomById(id);
        room.setStatus(status.toUpperCase().trim());
        return roomRepository.save(room);
    }

    private BigDecimal getDefaultPriceForType(String roomType) {
        return switch (roomType.toUpperCase()) {
            case "STANDARD" -> BigDecimal.valueOf(2500.00);
            case "DELUXE" -> BigDecimal.valueOf(3500.00);
            case "LUXURY" -> BigDecimal.valueOf(5000.00);
            default -> BigDecimal.valueOf(2500.00);
        };
    }
}
