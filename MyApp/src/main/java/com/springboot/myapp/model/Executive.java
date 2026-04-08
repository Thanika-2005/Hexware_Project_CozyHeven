package com.springboot.myapp.model;

import com.springboot.myapp.enums.JobTitle;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;


@Entity
@Table(name = "executives")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Executive {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @Column(name = "job_title")
    @Enumerated(EnumType.STRING)
    private JobTitle jobTitle;

    @OneToOne
    private User user;

}
