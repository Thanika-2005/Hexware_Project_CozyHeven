package com.springBoot.cozyheven.service;

import com.springBoot.cozyheven.dto.*;
import com.springBoot.cozyheven.exception.ResourceNotFoundException;
import com.springBoot.cozyheven.mapper.AmentityMapper;
import com.springBoot.cozyheven.mapper.BookingMapper;
import com.springBoot.cozyheven.mapper.HotelMapper;
import com.springBoot.cozyheven.model.Hotel;
import com.springBoot.cozyheven.model.HotelOwner;
import com.springBoot.cozyheven.model.User;
import com.springBoot.cozyheven.repository.*;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.event.Level;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
@Slf4j
public class HotelService {

    private final HotelRepository hotelRepository;
    private final BookingRepository bookingRepository;
    private final AmenityRepository amenityRepository;
    private final UserRepository userRepository;
    private final HotelOwnerRepository hotelOwnerRepository;

        public HotelPageRecordDto getAllHotels(int page, int size) {

            log.atLevel(Level.INFO).log("Called: getAllHotels - page={}, size={}", page, size);
            Pageable pageable = PageRequest.of(page, size);
            Page<Hotel> hotelPage = hotelRepository.findAll(pageable);
            long totalRecords = hotelPage.getTotalElements();
            int totalPages = hotelPage.getTotalPages();

            List<HotelPageResDto> dtos = hotelPage
                    .toList()
                    .stream()
                    .map(HotelMapper::mapToDto)
                    .toList();
            return new HotelPageRecordDto(dtos,
                    totalRecords,
                    totalPages
            );
        }

    public HotelDetailResDto getHotelById(long hotelId) {
        log.atLevel(Level.INFO).log("Called: getHotelById - hotelId={}", hotelId);
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid hotel Id"));

        List<AmenityDto> amenities = getAmenityDtosByHotelId(hotelId);

        return HotelMapper.mapToHotelDetailResDto(hotel, amenities);
    }

    private List<AmenityDto> getAmenityDtosByHotelId(long hotelId) {
        return amenityRepository.getAmentiesbyHotelId(hotelId)
                .stream()
                .map(AmentityMapper::mapToDto)
                .toList();
    }

    public List<HotelDetailResDto> getByFilter(FilterReqDto filterReqDto) {
        log.atLevel(Level.INFO).log("Called: getByFilter - location={}, rating={}",
                filterReqDto.location(), filterReqDto.rating());

        if (filterReqDto.location() == null && filterReqDto.rating() == null && filterReqDto.amenityNames() == null)
            return List.of();

        String location = (filterReqDto.location() != null && !filterReqDto.location().isEmpty())
                ? filterReqDto.location() : null;

        Integer rating = (filterReqDto.rating() != null && !filterReqDto.rating().equals(0))
                ? filterReqDto.rating() : null;

        List<String> amenityNames = (filterReqDto.amenityNames() != null && !filterReqDto.amenityNames().isEmpty())
                ? filterReqDto.amenityNames().stream().map(String::toLowerCase).toList()
                : null;

        return hotelRepository.getLocationAndRating(location, rating,amenityNames)
                .stream()
                .map(hotel -> {
                    List<AmenityDto> amenities = amenityRepository.getAmentiesbyHotelId(hotel.getHotelId())
                                    .stream()
                                    .map(AmentityMapper::mapToDto)
                                    .toList();
                            return HotelMapper.mapToHotelDetailResDto(hotel, amenities);
                        })
                .toList();
    }


    public List<HotelGuestDto> getHotelByGuestId(long guestId) {
        log.atLevel(Level.INFO).log("Called: getHotelByGuestId - guestId={}", guestId);
        return bookingRepository.getBookingsByGuestId(guestId).stream()
                .map(BookingMapper::mapToHotelGuestDto)
                .toList();
    }

    public List<HotelGuestDto> getHotelByGuest(String username) {
        log.atLevel(Level.INFO).log("Called: getHotelByGuest - user={}", username);
        return bookingRepository.getBookingsByGuestUsername(username)
                .stream()
                .map(BookingMapper::mapToHotelGuestDto)
                .toList();
    }

    public List<HotelDetailResDto> getHotelsByOwner(String username) {

        log.atLevel(Level.INFO).log("Called: getHotelsByOwner - user={}", username);
        // Step 1 — get the User row by username
        User user = userRepository.getUserByUsername(username);

        // Step 2 — get the HotelOwner profile linked to that user
        HotelOwner owner = hotelOwnerRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("No owner profile for: " + username));

        // Step 3 — get all hotels where hotel_owner_id = owner.id
        List<Hotel> hotels = hotelRepository.findByHotelOwner(owner);

        // Step 4 — map each hotel to HotelDetailResDto (with amenities)
        return hotels.stream()
                .map(hotel -> {
                    List<AmenityDto> amenities = getAmenityDtosByHotelId(hotel.getHotelId());
                    return HotelMapper.mapToHotelDetailResDto(hotel, amenities);
                })
                .toList();
    }

    public void addHotel(HotelReqDto hotelReqDto,String username) {
        log.atLevel(Level.INFO).log("Called: addHotel - user={}, hotelName={}",
                username, hotelReqDto.hotelName());

        User user = userRepository.getUserByUsername(username);

        // 2. Find the HotelOwner linked to that user
        HotelOwner owner = hotelOwnerRepository.findByUser(user)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel owner profile not found for user: " + username));
        Hotel hotel = new Hotel();


        hotel.setHotelName(hotelReqDto.hotelName());
        hotel.setLocation(hotelReqDto.location());
        hotel.setDescription(hotelReqDto.description());
        hotel.setRatings(hotelReqDto.ratings());
        hotel.setHotelOwner(owner);   // ← this is what was missing before

        hotelRepository.save(hotel);
    }


    public void updateHotel(long hotelId, HotelReqDto dto) {
        log.atLevel(Level.INFO).log("Called: updateHotel - hotelId={}", hotelId);
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found: " + hotelId));
        hotel.setHotelName(dto.hotelName());
        hotel.setLocation(dto.location());
        hotel.setDescription(dto.description());
        hotel.setRatings(dto.ratings());
        hotelRepository.save(hotel);
    }


    public void deleteHotel(long hotelId) {
        log.atLevel(Level.WARN).log("Called: deleteHotel - hotelId={}", hotelId);
        if (!hotelRepository.existsById(hotelId))
            throw new ResourceNotFoundException("Hotel not found: " + hotelId);
        hotelRepository.deleteById(hotelId);
    }


    public ResponseEntity<?> getGuestCount(long hotelId) {
            if(!hotelRepository.existsById(hotelId))
                throw new ResourceNotFoundException("Hotel Not Found");
            return bookingRepository.countGuest(hotelId);
    }
}
