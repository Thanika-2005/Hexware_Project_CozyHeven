package com.springBoot.cozyheven.repository;

import com.springBoot.cozyheven.enums.BookingStatus;
import com.springBoot.cozyheven.model.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface BookingRepository extends JpaRepository<Booking,Long> {

    @Query("""
    select b
        from Booking b
        where ?1 is null or b.bookingStatus = ?1
    """)
    List<Booking> getBookingStatus(BookingStatus bookingStatus);

    @Query("""
    select b from Booking b
    where b.guest.user.username = ?1
    """)
    List<Booking> getBookingsByGuestUsername(String username);

    @Query("""
    select b from Booking b
    where b.room.hotel.hotelId = ?1
    """)
    List<Booking> getBookingsByHotelId(long hotelId);

    @Query("""
    select b from Booking b
    where b.room.hotel.hotelOwner.user.username = ?1
    """)
    List<Booking> getBookingsByOwnerUsername(String username);


    @Query("""
            select b
            from Booking b
            where b.guest.user.username=?1
            """)
    List<Booking> getByCustomerUsername(String username);

    @Query("""
    select b from Booking b
    where b.guest.id = ?1
    """)
    List<Booking> getBookingsByGuestId(long guestId);

    @Query("""
        select count(b.guest.id) from  Booking b
        where b.room.hotel.hotelId = ?1
        """)
    ResponseEntity<?> countGuest(long hotelId);
}
