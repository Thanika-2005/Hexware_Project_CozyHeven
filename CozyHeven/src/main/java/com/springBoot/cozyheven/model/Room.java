package com.springBoot.cozyheven.model;

import com.springBoot.cozyheven.enums.AcType;
import com.springBoot.cozyheven.enums.BedType;
import com.springBoot.cozyheven.enums.RoomStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Room {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long roomId;

    private String roomSize;

    @Enumerated(EnumType.STRING)
    private BedType bedType;

    private BigDecimal basePrice;
    private int maxPeople;
    private int availability;

    @Enumerated(EnumType.STRING)
    private AcType acType;

    @Enumerated(EnumType.STRING)
    private RoomStatus status;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;

}

