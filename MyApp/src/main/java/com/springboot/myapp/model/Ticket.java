package com.springboot.myapp.model;

import com.springboot.myapp.enums.TicketPriority;
import com.springboot.myapp.enums.TicketStatus;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.Instant;

@Entity
@Table(name = "tickets")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class Ticket { //t

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String subject;

    @Column(length = 1000)
    private String details;

    @Enumerated(EnumType.STRING)
    private TicketPriority ticketPriority;
    @Enumerated(EnumType.STRING)
    private TicketStatus ticketStatus;

    @CreationTimestamp
    @Column(updatable = false)
    private Instant createdAt;

    @UpdateTimestamp
    private Instant updatedAt;

    @ManyToOne
    private Customer customer;

    @ManyToOne
    private Executive executive;
}


/*
 * Ticket M:1 Customer : If i inject Customer in Ticket, it will be @ManyToOne
 * Ticket M:1 Executive : @ManyToOne
 * */
