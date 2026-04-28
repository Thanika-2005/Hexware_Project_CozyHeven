package com.springBoot.cozyheven.mapper;

import com.springBoot.cozyheven.dto.ReviewReqDto;
import com.springBoot.cozyheven.dto.ReviewResDto;
import com.springBoot.cozyheven.model.Hotel;
import com.springBoot.cozyheven.model.Review;
import com.springBoot.cozyheven.model.User;

import java.time.LocalDate;

public class ReviewMapper {

    public static Review mapToEntity(ReviewReqDto dto, User user, Hotel hotel) {
        Review review = new Review();
        review.setRating(dto.rating());
        review.setTitle(dto.title());
        review.setComment(dto.comment());
        review.setUser(user);
        review.setHotel(hotel);
        review.setStayDate(LocalDate.now());
        return review;
    }

    public static ReviewResDto mapToDto(Review review) {
        return new ReviewResDto(
                review.getReviewId(),
                review.getRating(),
                review.getTitle(),
                review.getComment(),
                review.getUser().getUsername(),
                review.getStayDate(),
                review.getCreatedAt()
        );
    }
}
