package com.springBoot.cozyheven.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "hotels")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Hotel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long hotelId;

    private String hotelName;
    private String location;

    @Column(length = 1000)
    private String description;

    private Integer ratings;


    @ManyToOne
    private HotelOwner hotelOwner;

}
