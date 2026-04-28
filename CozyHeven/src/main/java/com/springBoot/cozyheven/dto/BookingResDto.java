package com.springBoot.cozyheven.dto;

import com.springBoot.cozyheven.enums.BedType;
import com.springBoot.cozyheven.enums.BookingStatus;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public record BookingResDto(
        Long bookingId,
        LocalDate checkInDate,
        LocalDate checkOutDate,
        BigDecimal totalPrice,
        BookingStatus bookingStatus,

        Long roomId,
        String roomSize,
        BedType bedType,
        String acType,

        String guestName,
        String email,

        LocalDate cancellationDate,
        Long hotelId,
        String hotelName
) {
}
