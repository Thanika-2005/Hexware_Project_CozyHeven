package com.springBoot.cozyheven.repository;

import com.springBoot.cozyheven.model.HotelOwner;
import com.springBoot.cozyheven.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;


import java.util.Optional;

@Repository
public interface HotelOwnerRepository extends JpaRepository<HotelOwner,Long> {

    Optional<HotelOwner> findByUser(User user);
}
