package com.springboot.myapp.dto;

import com.springboot.myapp.exceptions.ResourceNotFoundException;
import com.springboot.myapp.model.Plan;
import com.springboot.myapp.repository.PlanRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@AllArgsConstructor
public class PlanService {
    private final PlanRepository planRepository;

    public Plan getById(long planId) {
        return planRepository.findById(planId)
                .orElseThrow(() -> new ResourceNotFoundException("Invalid plan id given"));

    }
}
