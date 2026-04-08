package com.springboot.myapp.repository;

import com.springboot.myapp.enums.TicketPriority;
import com.springboot.myapp.enums.TicketStatus;
import com.springboot.myapp.model.Ticket;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface TicketRepository extends JpaRepository<Ticket,Long> {
    /* TicketRepository now has all JpaRepository methods */


    @Query("""
           select t
           from Ticket t
           where (?1 is null OR t.ticketPriority = ?1) and (?2 is null OR t.ticketStatus = ?2)
           """)
    List<Ticket> getPriorityAndStatus(TicketPriority ticketPriority, TicketStatus ticketStatus);

    @Query("""
    select t
    from Ticket t
    where t.customer.id = ?1
    """)
    List<Ticket> getTicketsByCustomerId(long customerId);

    @Query("""
            select t
            from Ticket t
            where t.customer.User.username=?1
            """)
    List<Ticket> getTicketsByCustomer(String username);

    @Modifying
    @Transactional
    @Query("""
            update Ticket t
            SET t.ticketStatus = ?1
            where t.id = ?2
            """)
    void updateStatusWithJpql(TicketStatus ticketStatus, long ticketId);


}

/*
 JpaRepository
    save(T) : T
    findAll() : List<T>
    findById(id) : T
    deleteById(id)
    saveAll(list)
* */
