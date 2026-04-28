package com.springBoot.cozyheven.repository;

import com.springBoot.cozyheven.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.Collection;
import java.util.List;

@Repository
public interface ReviewRepository extends JpaRepository<Review,Long> {


    @Query("""
    select re from Review re
    where re.hotel.hotelId = ?1
    """)
    List<Review> getReviewByHotelId(long hotelId);
}
