package com.springBoot.cozyheven.controller;

import com.springBoot.cozyheven.dto.*;
import com.springBoot.cozyheven.model.Hotel;
import com.springBoot.cozyheven.service.HotelService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/hotel")
@AllArgsConstructor

@CrossOrigin(origins = "http://localhost:5173")

public class HotelController {

    private final HotelService  hotelService;


    // shows all hotels in dashboard
    @GetMapping("/get-allhotel")
    public HotelPageRecordDto getAllHotels(@RequestParam(value = "page",required = false,defaultValue = "0")int page,
                                               @RequestParam(value = "size",required = false,defaultValue = "5")int size){

        return hotelService.getAllHotels(page,size);
    }

    // specific hotels
    @GetMapping("/get/{hotelId}")
    public HotelDetailResDto getHotelById(@PathVariable long hotelId) {

        return hotelService.getHotelById(hotelId);
    }
    // filter based on min rating, location, amenities
    @PostMapping("/get/filter")
    public List<HotelDetailResDto> getByFilter(@RequestBody FilterReqDto filterReqDto){
        return hotelService.getByFilter(filterReqDto);
    }


    // v1 — Admin fetches hotels visited by a specific guest using guestId
    @GetMapping("/guests/{guestId}/v1")
    public List<HotelGuestDto> getHotelByGuestId(@PathVariable long guestId) {
        return hotelService.getHotelByGuestId(guestId);
    }
    //v2 guest login
    @GetMapping("/guests/v2")
    public List<HotelGuestDto> getHotelByGuest(Principal principal) {
        return hotelService.getHotelByGuest(principal.getName());
    }



    // Add hotel - ADMIN and HOTEL OWNER
    @PostMapping("/add")
    public ResponseEntity<Void> addHotel(@RequestBody HotelReqDto hotelReqDto, Principal principal) {
        hotelService.addHotel(hotelReqDto , principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // Update hotel - HOTEL_OWNER or ADMIN
    @PutMapping("/update/{hotelId}")
    public ResponseEntity<Void> updateHotel(@PathVariable long hotelId,
                                         @RequestBody HotelReqDto hotelReqDto) {
        hotelService.updateHotel(hotelId, hotelReqDto);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    // Delete hotel - ADMIN only
    @DeleteMapping("/delete/{hotelId}")
    public ResponseEntity<Void> deleteHotel(@PathVariable long hotelId) {
        hotelService.deleteHotel(hotelId);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

    // Get hotels owned by the logged-in owner (for owner dashboard)
    @GetMapping("/my-hotels")
    public List<HotelDetailResDto> getMyHotels(Principal principal) {
        return hotelService.getHotelsByOwner(principal.getName());
    }

}
