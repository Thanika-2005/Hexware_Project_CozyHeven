package com.springBoot.cozyheven.model;

import com.springBoot.cozyheven.enums.AmenityCategory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "amenities")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Amenity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;


    @Enumerated(EnumType.STRING)
    private AmenityCategory category;

    @ManyToOne
    @JoinColumn(name = "hotel_id")
    private Hotel hotel;
}