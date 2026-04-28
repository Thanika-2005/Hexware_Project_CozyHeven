package com.springBoot.cozyheven.repository;

import com.springBoot.cozyheven.model.Guest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface GuestRepository extends JpaRepository<Guest,Long> {


    @Query("""
            select g from Guest g
            where g.user.username = ?1
            """)

    Guest getByUsername(String username);
}
