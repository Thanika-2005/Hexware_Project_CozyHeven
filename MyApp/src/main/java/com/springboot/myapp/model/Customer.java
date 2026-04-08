package com.springboot.myapp.model;


import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "customers")
@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class Customer {

    @Id
    @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private long id;

    private String name;

    @Column(unique = true)
    private String email;

    private String city;

    @OneToOne
    private User User;

}

/*
ISP Company
------------
Plans
1. 50 mbps 28 days Unlimited
2. 100 mbps 28 days Unlimited
3. 1 gbps 28 days 50GB
4. 25 mbps 56 days 25 GB Mobile
Customer      1:M          Plan
              M:1
              M:M  :- 2 ManyToOne

              customer_plan
              id
              customer_id
              plan_id
              start_date
              end_date
              discount
              coupon
*/

