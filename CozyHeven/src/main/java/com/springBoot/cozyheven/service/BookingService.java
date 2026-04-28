package com.springBoot.cozyheven.service;

import com.springBoot.cozyheven.dto.*;

import com.springBoot.cozyheven.enums.BookingStatus;
import com.springBoot.cozyheven.enums.RoomStatus;
import com.springBoot.cozyheven.exception.ResourceNotFoundException;
import com.springBoot.cozyheven.exception.RoomNotAvailableException;
import com.springBoot.cozyheven.mapper.BookingGuestMapper;
import com.springBoot.cozyheven.mapper.BookingMapper;
import com.springBoot.cozyheven.model.Booking;
import com.springBoot.cozyheven.model.BookingGuest;
import com.springBoot.cozyheven.model.Guest;
import com.springBoot.cozyheven.model.Room;
import com.springBoot.cozyheven.repository.BookingGuestRepository;
import com.springBoot.cozyheven.repository.BookingRepository;
import com.springBoot.cozyheven.repository.RoomRepository;
import lombok.AllArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.slf4j.event.Level;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;


@Service
@AllArgsConstructor
@Slf4j
public class BookingService {
    private final BookingRepository bookingRepository;
    private final BookingGuestRepository bookingGuestRepository;
    private final GuestService guestService;
    private final RoomRepository roomRepository;
    private final FareCalculatorService fareCalculatorService;


    public BookingPageResDto getAllBooking(int page, int size) {
        log.atLevel(Level.INFO).log("Called: getAllBooking - page={}, size={}", page, size);

        Pageable pageable = PageRequest.of(page, size);

        Page<Booking> bookingPage = bookingRepository.findAll(pageable);
        long totalRecords = bookingPage.getTotalElements();
        int totalPages = bookingPage.getTotalPages();

        List<BookingResDto> list = bookingPage
                .toList()
                .stream()
                .map(BookingMapper::mapToResDto)
                .toList();

        return new BookingPageResDto(
                list,
                totalRecords,
                totalPages
        );

    }

    public void createBooking(BookingReqDto bookingReqDto, String username) {
        log.atLevel(Level.INFO).log("Called: createBooking - user={}, roomId={}", username, bookingReqDto.roomId());
        Guest guest = guestService.getByUsername(username);

        Room room = roomRepository.findById(bookingReqDto.roomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        Booking booking = BookingMapper.mapToEntity(bookingReqDto);
        booking.setGuest(guest);
        booking.setRoom(room);
        booking.setBookingStatus(BookingStatus.CONFIRMED);

        double fare = fareCalculatorService.calculate(
                room,
                bookingReqDto.guests(),
                bookingReqDto.checkIn(),
                bookingReqDto.checkOut()
        );
        booking.setTotalPrice(BigDecimal.valueOf(fare));

        // save booking first to get the generated ID
        bookingRepository.save(booking);

        room = roomRepository.findById(bookingReqDto.roomId())
                .orElseThrow(() -> new ResourceNotFoundException("Room not found"));

        // Check if room is available before booking
        if (room.getStatus() != RoomStatus.AVAILABLE) {
            log.atLevel(Level.WARN).log("createBooking failed - roomId={} is not available", bookingReqDto.roomId());
            throw new RoomNotAvailableException("Room is not available for booking");
        }

        // Decrease availability
        room.setAvailability(room.getAvailability() - 1);

        // If no availability left, mark as OCCUPIED
        if (room.getAvailability() <= 0) {
            room.setStatus(RoomStatus.OCCUPIED);
        }

        roomRepository.save(room);


        List<BookingGuest> bookingGuests = bookingReqDto.guests()
                .stream()
                .map(g -> BookingGuestMapper.mapToEntity(g, booking))
                .toList();

        bookingGuestRepository.saveAll(bookingGuests);// save guests separately
        log.atLevel(Level.INFO).log("Booking created - user={}, fare={}", username, fare);
    }

    public List<BookingResDto> getByFilter(BookingFilterReqDto bookingFilterReqDto) {
        if (bookingFilterReqDto.bookingStatus() == null)
            return List.of();


        BookingStatus bookingStatus = (bookingFilterReqDto.bookingStatus() != null && !bookingFilterReqDto.bookingStatus().isEmpty())
                ? BookingStatus.valueOf(bookingFilterReqDto.bookingStatus()) : null;

        return bookingRepository.getBookingStatus(bookingStatus)
                .stream()
                .map(BookingMapper::mapToResDto)
                .toList();

    }



    public void cancelBooking(long bookingId,String username) {
        log.atLevel(Level.INFO).log("Called: cancelBooking - bookingId={}, user={}", bookingId, username);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (!booking.getGuest().getUser().getUsername().equals(username)) {
            log.atLevel(Level.WARN).log("cancelBooking unauthorized - bookingId={}, user={}",
                    bookingId, username);
            throw new RuntimeException("Unauthorized");
        }
        if (booking.getBookingStatus() == BookingStatus.CANCELLED) {
            throw new ResourceNotFoundException("Booking is already cancelled");
        }

        booking.setBookingStatus(BookingStatus.CANCELLED);
        booking.setCancellationDate(LocalDate.now());
        // restore room
        Room room = booking.getRoom();
        room.setAvailability(room.getAvailability() + 1);

        // Restore to AVAILABLE if it was OCCUPIED
        if (room.getStatus() == RoomStatus.OCCUPIED) {
            room.setStatus(RoomStatus.AVAILABLE);
        }

        roomRepository.save(room);
        bookingRepository.save(booking);
        log.atLevel(Level.INFO).log("Booking {} cancelled by user={}", bookingId, username);
    }

    public void refundBooking(long bookingId) {

        log.atLevel(Level.INFO).log("Called: refundBooking - bookingId={}", bookingId);
        Booking booking = bookingRepository.findById(bookingId)
                .orElseThrow(() -> new ResourceNotFoundException("Booking not found"));

        if (booking.getBookingStatus() != BookingStatus.CANCELLED) {
            log.atLevel(Level.WARN).log("refundBooking failed - booking {} not CANCELLED", bookingId);
            throw new ResourceNotFoundException("Can only refund a cancelled booking");
        }

        booking.setBookingStatus(BookingStatus.REFUNDED);
        bookingRepository.save(booking);
    }

    public List<BookingResDto> getBookingsByGuest(String username) {

        log.atLevel(Level.INFO).log("Called: getBookingsByGuest - user={}", username);
        List<Booking> bookings = bookingRepository.getBookingsByGuestUsername(username);
        return bookings.stream()
                .map(BookingMapper::mapToResDto)
                .toList();
    }

    public List<BookingResDto> getBookingsByHotel(long hotelId) {
        log.atLevel(Level.INFO).log("Called: getBookingsByHotel - hotelId={}", hotelId);
        List<Booking> bookings = bookingRepository.getBookingsByHotelId(hotelId);
        return bookings.stream()
                .map(BookingMapper::mapToResDto)
                .toList();
    }



    public List<BookingResDto> getBookingsByOwner(String username) {
        log.atLevel(Level.INFO).log("Called: getBookingsByOwner - user={}", username);
        return bookingRepository.getBookingsByOwnerUsername(username)
                .stream()
                .map(BookingMapper::mapToResDto)
                .toList();
    }

    public List<BookingStatDto> getStatsForGuest(String username) {
        log.atLevel(Level.INFO).log("Called: getStatsForGuest - user={}", username);
        List<Booking> bookingList = bookingRepository.getByCustomerUsername(username);

        List<Booking> cancelled = bookingList
                .stream()
                .filter(b -> b.getBookingStatus().equals(BookingStatus.CANCELLED))
                .toList();

        List<Booking> confirmed = bookingList
                .stream()
                .filter(b -> b.getBookingStatus().equals(BookingStatus.CONFIRMED))
                .toList();
        List<Booking> refunded = bookingList
                .stream()
                .filter(b -> b.getBookingStatus().equals(BookingStatus.REFUNDED))
                .toList();

        BookingStatDto statDto1 = new BookingStatDto(
                "CANCELLED BOOKING",
                cancelled.size()
        );
        BookingStatDto statDto2 = new BookingStatDto(
                "CONFIRMED BOOKING",
                confirmed.size()
        );
        BookingStatDto statDto3 = new BookingStatDto(
                "REFUNDED BOOKING",
                refunded.size()
        );

        return List.of(statDto1,statDto2,statDto3);
    }


}