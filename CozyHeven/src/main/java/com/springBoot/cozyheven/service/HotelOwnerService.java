package com.springBoot.cozyheven.service;

import com.springBoot.cozyheven.dto.HotelOwnerReqDto;
import com.springBoot.cozyheven.enums.Role;
import com.springBoot.cozyheven.exception.ResourceNotFoundException;
import com.springBoot.cozyheven.model.Hotel;
import com.springBoot.cozyheven.model.HotelOwner;
import com.springBoot.cozyheven.model.User;
import com.springBoot.cozyheven.repository.HotelOwnerRepository;
import com.springBoot.cozyheven.repository.HotelRepository;
import com.springBoot.cozyheven.repository.UserRepository;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@AllArgsConstructor
public class HotelOwnerService {

    private final HotelOwnerRepository hotelOwnerRepository;
    private final HotelRepository hotelRepository;
    private final PasswordEncoder passwordEncoder;
    private final UserRepository userRepository;




    public void addHotelOwner(HotelOwnerReqDto hotelOwnerReqDto) {
        User user = new User();
        user.setUsername(hotelOwnerReqDto.username());
        user.setPassword(passwordEncoder.encode(hotelOwnerReqDto.password()));
        user.setEmail(hotelOwnerReqDto.email());
        user.setRole(Role.HOTEL_OWNER);
        userRepository.save(user);

        HotelOwner owner = new HotelOwner();
        owner.setName(hotelOwnerReqDto.name());
        owner.setUser(user);
        hotelOwnerRepository.save(owner);

        Hotel hotel = new Hotel();
        hotel.setHotelName(hotelOwnerReqDto.hotelName());
        hotel.setLocation(hotelOwnerReqDto.location());
        hotel.setDescription(hotelOwnerReqDto.description());
        hotel.setRatings(hotelOwnerReqDto.ratings());
        hotel.setHotelOwner(owner);   // ← the FK link
        hotelRepository.save(hotel);
    }

    public void assignOwnerToHotel(long hotelId, long ownerId) {
        Hotel hotel = hotelRepository.findById(hotelId)
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));
        HotelOwner owner = hotelOwnerRepository.findById(ownerId)
                .orElseThrow(() -> new ResourceNotFoundException("Owner not found"));
        hotel.setHotelOwner(owner);
        hotelRepository.save(hotel);
    }

    public List<HotelOwner> getAllOwners() {
        return hotelOwnerRepository.findAll();
    }
}
