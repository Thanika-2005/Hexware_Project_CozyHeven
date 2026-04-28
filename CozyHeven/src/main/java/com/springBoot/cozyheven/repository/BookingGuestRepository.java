package com.springBoot.cozyheven.repository;

import com.springBoot.cozyheven.model.BookingGuest;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface BookingGuestRepository extends JpaRepository<BookingGuest, Long> {

}
