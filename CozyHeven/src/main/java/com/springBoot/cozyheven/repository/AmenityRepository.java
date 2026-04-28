package com.springBoot.cozyheven.repository;

import com.springBoot.cozyheven.model.Amenity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface AmenityRepository extends JpaRepository<Amenity,Long> {



    @Query("""
    select a from Amenity a
    where a.hotel.hotelId = ?1
    """)
    List<Amenity> getAmentiesbyHotelId(long hotelId);


}
