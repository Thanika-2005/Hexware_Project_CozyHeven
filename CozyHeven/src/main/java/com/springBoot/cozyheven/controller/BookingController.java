package com.springBoot.cozyheven.controller;

import com.springBoot.cozyheven.dto.*;
import com.springBoot.cozyheven.enums.BookingStatus;
import com.springBoot.cozyheven.model.Booking;
import com.springBoot.cozyheven.model.Hotel;
import com.springBoot.cozyheven.service.BookingService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/booking")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class BookingController {

    private BookingService bookingService;

    // Admin
    @GetMapping("/get-allBooking")
    public BookingPageResDto getAllBooking(@RequestParam(value = "page",required = false,defaultValue = "0")int page,
                                           @RequestParam(value = "size",required = false,defaultValue = "5")int size){

        return bookingService.getAllBooking(page,size);
    }
    // guest
    @PostMapping("/add")
    public ResponseEntity<Void> createBooking(@Valid @RequestBody BookingReqDto bookingReqDto,
                                           Principal principal) {
        bookingService.createBooking(bookingReqDto,principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED)
                .build();
    }
    // booking status
    @PostMapping("/get/filter")
    public List<BookingResDto> getByFilter(@RequestBody BookingFilterReqDto bookingFilterReqDto){
        return bookingService.getByFilter(bookingFilterReqDto);
    }

    // guest
    @PutMapping("/cancel/{bookingId}")
    public ResponseEntity<Void> cancelBooking(@PathVariable long bookingId, Principal principal) {
        bookingService.cancelBooking(bookingId,principal.getName());
        return ResponseEntity.ok().build();
    }


    // admin or hotel owner
    @PutMapping("/refund/{bookingId}")
    public ResponseEntity<Void> refundBooking(@PathVariable long bookingId) {
        bookingService.refundBooking(bookingId);
        return ResponseEntity.ok().build();
    }

    // guest booking
    @GetMapping("/my-bookings")
    public List<BookingResDto> getMyBookings(Principal principal) {
        return bookingService.getBookingsByGuest(principal.getName());
    }


    // admin view
    @GetMapping("/hotel/{hotelId}")
    public List<BookingResDto> getBookingsByHotel(@PathVariable long hotelId) {
        return bookingService.getBookingsByHotel(hotelId);
    }

    // Hotel Owner Bookings
    @GetMapping("/my-hotel/bookings")
    public List<BookingResDto> getMyHotelBookings(Principal principal) {
        return bookingService.getBookingsByOwner(principal.getName());
    }

    @GetMapping("/stats")
    public List<BookingStatDto> getBookingStats(Principal principal) {
        String username = principal.getName();
        return bookingService.getStatsForGuest(username);
    }
}
