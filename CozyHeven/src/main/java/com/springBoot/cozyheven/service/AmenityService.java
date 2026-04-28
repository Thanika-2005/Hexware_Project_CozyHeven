package com.springBoot.cozyheven.service;

import com.springBoot.cozyheven.dto.AmenityDto;
import com.springBoot.cozyheven.dto.AmenityReqDto;
import com.springBoot.cozyheven.exception.ResourceNotFoundException;
import com.springBoot.cozyheven.mapper.AmentityMapper;
import com.springBoot.cozyheven.model.Amenity;
import com.springBoot.cozyheven.model.Hotel;
import com.springBoot.cozyheven.repository.AmenityRepository;
import com.springBoot.cozyheven.repository.HotelRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;

@Service
@AllArgsConstructor
public class AmenityService {

    private final AmenityRepository amenityRepository;
    private final HotelRepository hotelRepository;

    public List<AmenityDto> getAll() {
        List <Amenity > amenities = amenityRepository.findAll();

        return amenities
                .stream()
                .map(AmentityMapper::mapToDto)
                .sorted(Comparator.comparing(AmenityDto::name))
                .toList();


    }

    public List<AmenityDto> getByHotel(long hotelId) {
        List <Amenity > amenities = amenityRepository.getAmentiesbyHotelId(hotelId);

        return amenities
                .stream()
                .map(AmentityMapper::mapToDto)
                .toList();

    }

    public void add(AmenityReqDto dto) {
        Hotel hotel = hotelRepository.findById(dto.hotelId())
                .orElseThrow(()-> new ResourceNotFoundException("Hotel not found"));

        Amenity amenity = new Amenity();
        amenity.setName(dto.name());
        amenity.setCategory(dto.category());
        amenity.setHotel(hotel);
        amenityRepository.save(amenity);
    }

    public void delete(Long id) {
        amenityRepository.deleteById(id);
    }
}
