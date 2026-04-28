package com.springBoot.cozyheven.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "booking_guests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class BookingGuest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private String name;
    private int age;
    private String phone;
    private String gender;
    private String address;

    @Column(name = "aadhaar_path")
    private String aadhaarPath;

    @ManyToOne
    @JoinColumn(name = "booking_id")
    private Booking booking;


}
