package com.springBoot.cozyheven.service;

import com.springBoot.cozyheven.dto.GuestSignUpDto;
import com.springBoot.cozyheven.enums.Role;
import com.springBoot.cozyheven.exception.ResourceNotFoundException;
import com.springBoot.cozyheven.mapper.GuestMapper;
import com.springBoot.cozyheven.mapper.UserMapper;
import com.springBoot.cozyheven.model.Guest;
import com.springBoot.cozyheven.model.User;
import com.springBoot.cozyheven.repository.GuestRepository;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class GuestService {
    private final PasswordEncoder passwordEncoder;
    private final GuestRepository guestRepository;
    private final UserService userService;

    public Guest getById(long guestId) {
       return guestRepository.findById(guestId)
               .orElseThrow(()->new ResourceNotFoundException(("Invalid guest id given")));
    }

    public void addGuestSignUp(@Valid GuestSignUpDto guestSignUpDto) {
        //1. Map DTO to guest entity
        Guest guest = GuestMapper.mapToEntity(guestSignUpDto);
        //2. Map Dto user entity
        User user = UserMapper.mapToEntity(guestSignUpDto);
        // Step 3: Add role and other details to User entity -- ensure password in encrypted
        user.setRole(Role.GUEST);
        user.setPassword(passwordEncoder.encode(guestSignUpDto.password()));
        // Step 4 Save User in Db : so that, we get ID of the user attached to it
        user = userService.insertUser(user);

        // 5.add user to guest
        guest.setUser(user);
        // Step 6: Save Object
        guestRepository.save(guest);

    }
    public Guest getByUsername(String username) {
        return guestRepository.getByUsername(username);
    }
}
