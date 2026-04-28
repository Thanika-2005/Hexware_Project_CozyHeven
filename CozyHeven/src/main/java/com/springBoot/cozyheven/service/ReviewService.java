package com.springBoot.cozyheven.service;

import com.springBoot.cozyheven.dto.ReviewReqDto;
import com.springBoot.cozyheven.dto.ReviewResDto;
import com.springBoot.cozyheven.exception.ResourceNotFoundException;
import com.springBoot.cozyheven.mapper.ReviewMapper;
import com.springBoot.cozyheven.model.Hotel;
import com.springBoot.cozyheven.model.Review;
import com.springBoot.cozyheven.model.User;
import com.springBoot.cozyheven.repository.HotelRepository;
import com.springBoot.cozyheven.repository.ReviewRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final HotelRepository hotelRepository;
    private final UserService userService;

    public void addReview(ReviewReqDto dto, String username) {
        User user = (User) userService.loadUserByUsername(username);
        Hotel hotel = hotelRepository.findById(dto.hotelId())
                .orElseThrow(() -> new ResourceNotFoundException("Hotel not found"));
        Review review = ReviewMapper.mapToEntity(dto,user,hotel);

        reviewRepository.save(review);
    }

    public List<ReviewResDto> getByHotel(long hotelId) {

        List<Review>  reviews = reviewRepository.getReviewByHotelId(hotelId);
        return  reviews
                .stream()
                .map(ReviewMapper::mapToDto)
                .toList();
    }
}
