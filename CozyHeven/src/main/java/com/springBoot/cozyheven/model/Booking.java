package com.springBoot.cozyheven.model;

import com.springBoot.cozyheven.enums.BookingStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "bookings")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Booking {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bookingId;

    private LocalDate checkIn;
    private LocalDate checkOut;
    private Integer adults;
    private Integer children;
    private Integer totalPeople;
    private BigDecimal totalPrice;

    @Enumerated(EnumType.STRING)
    private BookingStatus bookingStatus;

    private LocalDate cancellationDate;



    @ManyToOne
    @JoinColumn(name = "room_id")
    private Room room;

    @ManyToOne
    private Guest guest;


}