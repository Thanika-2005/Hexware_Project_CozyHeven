package com.springBoot.cozyheven.mapper;

import com.springBoot.cozyheven.dto.BookingGuestReqDto;
import com.springBoot.cozyheven.model.Booking;
import com.springBoot.cozyheven.model.BookingGuest;

public class BookingGuestMapper {
    public static BookingGuest mapToEntity(BookingGuestReqDto dto, Booking booking) {
        BookingGuest bookingGuest = new BookingGuest();
        bookingGuest.setName(dto.name());
        bookingGuest.setAge(dto.age());
        bookingGuest.setGender(dto.gender());
        bookingGuest.setPhone(dto.phone());
        bookingGuest.setAddress(dto.address());
        bookingGuest.setAadhaarPath(dto.aadhaarPath());
        bookingGuest.setBooking(booking);
        return bookingGuest;
    }
}
