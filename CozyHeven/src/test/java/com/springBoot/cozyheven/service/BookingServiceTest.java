package com.springBoot.cozyheven.service;

import com.springBoot.cozyheven.enums.AcType;
import com.springBoot.cozyheven.enums.BedType;
import com.springBoot.cozyheven.model.*;
import com.springBoot.cozyheven.repository.BookingRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.*;

import java.time.LocalDate;
import java.util.List;

import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class BookingServiceTest {

    @InjectMocks
    private BookingService bookingService;

    @Mock
    private BookingRepository bookingRepository;

    @Test
    public void getAllBooking() {

        // Setup Hotel
        Hotel hotel = new Hotel();
        hotel.setHotelId(1L);
        hotel.setHotelName("Grand Chola");

        // Setup Room
        Room room = new Room();
        room.setRoomId(101L);
        room.setRoomSize("Large");
        room.setBedType(BedType.KING);
        room.setAcType(AcType.CENTRAL);
        room.setHotel(hotel);

        // Setup User (inside Guest)
        User user = new User();
        user.setId(1L);
        user.setUsername("john_doe");

        // Setup Guest (with User inside)
        Guest guest = new Guest();
        guest.setName("John");
        guest.setEmail("john@gmail.com");
        guest.setCity("Chennai");
        guest.setUser(user);

        // Booking 1
        Booking booking = new Booking();
        booking.setBookingId(1L);
        booking.setRoom(room);
        booking.setGuest(guest);
        booking.setCheckIn(LocalDate.now());
        booking.setCheckOut(LocalDate.now().plusDays(2));
        booking.setAdults(3);
        booking.setChildren(2);
        booking.setTotalPeople(5);

        // Booking 2
        Booking booking1 = new Booking();
        booking1.setBookingId(20L);
        booking1.setRoom(room);
        booking1.setGuest(guest);
        booking1.setCheckIn(LocalDate.now());
        booking1.setCheckOut(LocalDate.now().plusDays(3));
        booking1.setAdults(2);
        booking1.setChildren(2);
        booking1.setTotalPeople(4);

        List<Booking> list = List.of(booking, booking1);

        Page<Booking> bookingPage = new PageImpl<>(list);
        Pageable pageable = PageRequest.of(0, 2);

        when(bookingRepository.findAll(pageable)).thenReturn(bookingPage);

        Assertions.assertEquals(2, bookingService.getAllBooking(0, 2).data().size());
    }
}