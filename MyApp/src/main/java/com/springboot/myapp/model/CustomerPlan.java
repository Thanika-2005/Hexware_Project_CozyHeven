package com.springboot.myapp.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.LocalDate;

@Entity
@AllArgsConstructor
@Table(name = "customer_plan")
@NoArgsConstructor
@Getter
@Setter
public class CustomerPlan {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long id;

    private LocalDate start_date;
    private LocalDate end_date;
    private BigDecimal discount;
    private String coupon;

    @ManyToOne
    private Customer customer;

    @ManyToOne
    private Plan plan;
}
