package com.springBoot.cozyheven.mapper;

import com.springBoot.cozyheven.dto.*;
import com.springBoot.cozyheven.enums.AcType;
import com.springBoot.cozyheven.model.Booking;
import com.springBoot.cozyheven.model.BookingGuest;

import java.util.List;

public class BookingMapper {

    public static Booking mapToEntity(BookingReqDto bookingReqDto) {
        Booking booking = new Booking();
        booking.setCheckIn(bookingReqDto.checkIn());
        booking.setCheckOut(bookingReqDto.checkOut());
        booking.setAdults(bookingReqDto.adults());
        booking.setChildren(bookingReqDto.children());
        booking.setTotalPeople(bookingReqDto.adults() + bookingReqDto.children());
        return booking;
    }

    public static BookingReqDto mapToDto(Booking booking) {
        return new BookingReqDto(
                booking.getCheckIn(),
                booking.getCheckOut(),
                booking.getAdults(),
                booking.getChildren(),
                booking.getTotalPeople(),
                booking.getRoom() != null ? booking.getRoom().getRoomId() : null,
                List.of()

        );
    }

    public static BookingResDto mapToResDto(Booking booking) {
        return new BookingResDto(
                booking.getBookingId(),
                booking.getCheckIn(),
                booking.getCheckOut(),
                booking.getTotalPrice(),
                booking.getBookingStatus(),

                booking.getRoom().getRoomId(),
                booking.getRoom().getRoomSize(),
                booking.getRoom().getBedType(),
                booking.getRoom().getAcType().name(),
                booking.getGuest().getName(),
                booking.getGuest().getUser().getUsername(),

                booking.getCancellationDate(),
                booking.getRoom().getHotel().getHotelId(),
                booking.getRoom().getHotel().getHotelName()
        );
    }

    public static HotelGuestDto mapToHotelGuestDto(Booking booking) {
        return new HotelGuestDto(
                booking.getRoom().getHotel().getHotelId(),
                booking.getRoom().getHotel().getHotelName(),
                booking.getRoom().getHotel().getLocation(),
                booking.getRoom().getHotel().getRatings(),
                booking.getGuest().getName()
        );
    }
}
