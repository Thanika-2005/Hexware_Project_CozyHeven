package com.springboot.myapp.repository;

import com.springboot.myapp.model.Customer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface CustomerRepository extends JpaRepository<Customer,Long> {


    @Query("""
        select c
        from Customer c
        where (?1 is null or c.city =?1)and (?2 is null or c.email =?2)
        """)
    List<Customer> getFilterByCustomer(String customerCity, String customerEmail);


    @Query("""
            select c from Customer c
            where c.User.username = ?1
            """)
    Customer getByUsername(String username);
}
