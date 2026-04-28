package com.springBoot.cozyheven.controller;


import com.springBoot.cozyheven.service.HotelService;
import lombok.AllArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/hotel")
@AllArgsConstructor
public class TestController {

    private final HotelService hotelService;

    @GetMapping("/{hotelId}/guest-count")
    public ResponseEntity<?> getGuestCount(@PathVariable long hotelId){
        return hotelService.getGuestCount(hotelId);

    }
}

