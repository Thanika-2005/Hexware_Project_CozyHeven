package com.springBoot.cozyheven.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "guest")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Guest {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String city;

    @OneToOne
    private User user;

}
