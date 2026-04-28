package com.springBoot.cozyheven.controller;
import com.springBoot.cozyheven.dto.AdminReqDto;
import com.springBoot.cozyheven.dto.BookingResDto;
import com.springBoot.cozyheven.dto.HotelOwnerReqDto;
import com.springBoot.cozyheven.model.HotelOwner;
import com.springBoot.cozyheven.service.AdminService;
import com.springBoot.cozyheven.service.BookingService;
import com.springBoot.cozyheven.service.HotelOwnerService;
import com.springBoot.cozyheven.service.HotelService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("api/hotel/owner")

@CrossOrigin(origins = "http://localhost:5173")
@AllArgsConstructor
public class HotelOwnerController {
    private final HotelOwnerService hotelOwnerService;


    @PostMapping("/add")
    public void addHotelOwner(@RequestBody HotelOwnerReqDto hotelOwnerReqDto){
        hotelOwnerService.addHotelOwner(hotelOwnerReqDto);
    }

    // In HotelOwnerController - Assign Hotels to owner -- admin
    @PutMapping("/assign/{hotelId}/{ownerId}")
    public ResponseEntity<Void> assignOwnerToHotel(@PathVariable long hotelId,
                                                @PathVariable long ownerId) {
        hotelOwnerService.assignOwnerToHotel(hotelId, ownerId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }
    @GetMapping("/all")
    public ResponseEntity<List<HotelOwner>> getAllOwners() {
        return ResponseEntity.ok(hotelOwnerService.getAllOwners());
    }

}
