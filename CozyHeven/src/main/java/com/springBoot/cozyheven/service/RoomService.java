package com.springBoot.cozyheven.service;

import com.springBoot.cozyheven.dto.*;
import com.springBoot.cozyheven.enums.AcType;
import com.springBoot.cozyheven.enums.BedType;
import com.springBoot.cozyheven.exception.ResourceNotFoundException;
import com.springBoot.cozyheven.mapper.RoomMapper;
import com.springBoot.cozyheven.model.*;
import com.springBoot.cozyheven.repository.HotelOwnerRepository;
import com.springBoot.cozyheven.repository.HotelRepository;
import com.springBoot.cozyheven.repository.RoomRepository;
import com.springBoot.cozyheven.repository.UserRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.event.Level;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class RoomService {
    private final RoomRepository roomRepository;
    private final HotelRepository hotelRepository;
    private final UserRepository userRepository;
    private final HotelOwnerRepository hotelOwnerRepository;

    public RoomPageRecordDto getAllRooms(int page, int size) {
        log.atLevel(Level.INFO).log("Called: getAllRooms - page={}, size={}", page, size);
        Pageable pageable = PageRequest.of(page, size);
        Page<Room> roomPage = roomRepository.findAll(pageable);
        long totalRecords = roomPage.getTotalElements();
        int totalPages = roomPage.getTotalPages();

        List<RoomResDto> dtos = roomPage
                .toList()
                .stream()
                .map(RoomMapper::mapToDto)
                .toList();

        return new RoomPageRecordDto(dtos, totalRecords, totalPages);
    }

    public void addRooms(RoomReqDto roomReqDto, long hotelId) {
        log.atLevel(Level.INFO).log("Called: addRooms - hotelId={}", hotelId);
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));
        Room room = RoomMapper.mapToEntity(roomReqDto);
        room.setHotel(hotel);
        roomRepository.save(room);
        log.atLevel(Level.INFO).log("Room added to hotel {} successfully", hotelId);
    }

    // v1 permit all
    public List<RoomResDto> getRoomsByHotel(long hotelId) {
        log.atLevel(Level.INFO).log("Called: getRoomsByHotel - hotelId={}", hotelId);
        hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));


        List<Room> list = roomRepository.getRoombyHotelId(hotelId);

        return list
                .stream()
                .map(RoomMapper::mapToDto)
                .toList();
    }

    // v2 — Hotel Owner: rooms across all their hotels via Principal
    public List<RoomResDto> getRoomsByOwner(String username) {

        log.atLevel(Level.INFO).log("Called: getRoomsByOwner - user={}", username);
        return roomRepository.getRoomsByOwnerUsername(username)
                .stream()
                .map(RoomMapper::mapToDto)
                .toList();
    }



    public List<RoomResDto> getfilterRooms(long hotelId, RoomFilterReqDto filterReqDto) {
        log.atLevel(Level.INFO).log("Called: getfilterRooms - hotelId={}", hotelId);
        BedType bedType = (filterReqDto.bedType() != null)
                ? BedType.valueOf(filterReqDto.bedType()) : null;

        AcType acType = (filterReqDto.acType() != null)
                ? AcType.valueOf(filterReqDto.acType()) : null;


        return roomRepository.filterRooms(hotelId, bedType, acType, filterReqDto.maxPrice())
                .stream()
                .map(RoomMapper::mapToDto)
                .toList();

    }

    public void updateRoom(RoomReqDto roomReqDto, long roomId) {
        log.atLevel(Level.INFO).log("Called: updateRoom - roomId={}", roomId);
        Room room = roomRepository.findById(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room not found: " + roomId));



        room.setBedType(roomReqDto.bedType());
        room.setRoomSize(roomReqDto.roomSize());
        room.setAcType(roomReqDto.acType());
        room.setMaxPeople(roomReqDto.maxPeople());
        room.setBasePrice(roomReqDto.basePrice());
        room.setAvailability(roomReqDto.availability());
        room.setStatus(roomReqDto.status());

        roomRepository.save(room);
        log.atLevel(Level.INFO).log("Room {} updated successfully", roomId);
    }


    public void deleteRoom(long roomId) {
        log.atLevel(Level.WARN).log("Called: deleteRoom - roomId={}", roomId);
        if (!roomRepository.existsById(roomId))
            throw new ResourceNotFoundException("Room not found: " + roomId);
        roomRepository.deleteById(roomId);
        log.atLevel(Level.INFO).log("Room {} deleted successfully", roomId);
    }


}
