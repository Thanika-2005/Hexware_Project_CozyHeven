package com.springBoot.cozyheven.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


// model/HotelOwner.java
@Entity
@Table(name = "hotel_owners")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class HotelOwner {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @OneToOne
    private User user;


}