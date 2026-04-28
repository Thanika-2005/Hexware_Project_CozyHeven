package com.springBoot.cozyheven.controller;

import com.springBoot.cozyheven.dto.ReviewReqDto;
import com.springBoot.cozyheven.dto.ReviewResDto;
import com.springBoot.cozyheven.service.ReviewService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@RequestMapping("/api/review")
@AllArgsConstructor
@CrossOrigin(origins = "http://localhost:5173")
public class ReviewController {

    private final ReviewService reviewService;

    // guest only
    @PostMapping("/add")
    public ResponseEntity<Void> add(@RequestBody ReviewReqDto dto, Principal principal) {
        reviewService.addReview(dto, principal.getName());
        return ResponseEntity.status(HttpStatus.CREATED).build();
    }

    // get review in hotel page
    @GetMapping("/hotel/{hotelId}")
    public List<ReviewResDto> getByHotel(@PathVariable long hotelId) {
        return reviewService.getByHotel(hotelId);
    }




}
