package com.springBoot.cozyheven.repository;

import com.springBoot.cozyheven.model.Hotel;
import com.springBoot.cozyheven.model.HotelOwner;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface HotelRepository extends JpaRepository<Hotel,Long> {


    @Query("""
    select  distinct h
    from Hotel h
    where(?1 is null OR h.location =  lower(?1)) and (?2 is null OR h.ratings = ?2)
    and (?3 is null or exists (select a from Amenity a where a.hotel = h and lower(a.name) in ?3))
    """)
    List<Hotel> getLocationAndRating(String location, Integer rating, List<String> amenityNames); // correct



    List<Hotel> findByHotelOwner(HotelOwner owner);
}

