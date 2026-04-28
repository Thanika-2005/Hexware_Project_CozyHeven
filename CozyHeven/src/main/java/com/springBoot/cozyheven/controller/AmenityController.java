package com.springBoot.cozyheven.controller;


import com.springBoot.cozyheven.dto.AmenityDto;
import com.springBoot.cozyheven.dto.AmenityReqDto;
import com.springBoot.cozyheven.service.AmenityService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/amenity")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class AmenityController {

    private final AmenityService amenityService;

    //get All amenities
    @GetMapping("/all")
    public List<AmenityDto> getAll() {
        return amenityService.getAll();
    }

    //get Amenities by hotel
    @GetMapping("/hotel/{hotelId}")
    public List<AmenityDto> getByHotel(@PathVariable long hotelId) {
        return amenityService.getByHotel(hotelId);
    }

    //add amenities - admin
    @PostMapping("/add")
    public ResponseEntity<Void> add(@RequestBody AmenityReqDto dto) {
        amenityService.add(dto);
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // delete amenities by id - hotel owner
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        amenityService.delete(id);
        return ResponseEntity.ok().build();
    }
}
