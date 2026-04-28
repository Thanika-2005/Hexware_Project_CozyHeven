package com.springBoot.cozyheven.controller;

import com.springBoot.cozyheven.dto.GuestResponseDto;
import com.springBoot.cozyheven.dto.GuestSignUpDto;
import com.springBoot.cozyheven.mapper.GuestMapper;
import com.springBoot.cozyheven.model.Guest;
import com.springBoot.cozyheven.service.GuestService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@AllArgsConstructor
@RequestMapping("/api/guest")
@CrossOrigin(origins = "http://localhost:5173/")
public class GuestController {
    private GuestService guestService;

    @PostMapping("/sign-up")
    public ResponseEntity<Void> addGuestWithCredentials(@Valid @RequestBody GuestSignUpDto customerSignUpDto){
        guestService.addGuestSignUp(customerSignUpDto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }
    @GetMapping("/get-one")
    public GuestResponseDto getCustomer(Principal principal){
        String customerUsername = principal.getName();
        Guest guest =  guestService.getByUsername(customerUsername);
        return GuestMapper.mapEntityToDto(guest);
    }

}
