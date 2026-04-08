package com.springboot.myapp.controller;

import com.springboot.myapp.dto.CustomerPlanReqDto;
import com.springboot.myapp.dto.PlanCustomerDto;
import com.springboot.myapp.service.CustomerPlanService;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;
import java.util.List;

@RestController
@AllArgsConstructor
@RequestMapping("/api/customer/plan")
public class CustomerPlanController {

    private final CustomerPlanService customerPlanService;

    // Customer buys plan (logged-in user)
    @PostMapping("/add/{planId}/v1")
    public ResponseEntity<?> buyPlan(@RequestBody CustomerPlanReqDto customerPlanReqDto,
                                     Principal principal,
                                     @PathVariable long planId){
        customerPlanService.buyPlanByCustomer(principal.getName(),planId,customerPlanReqDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .build();
    }

    // Admin assigns plan to customer
    @PostMapping("/add/admin/{customerId}/{planId}/v2")
    public ResponseEntity<?> assignPlanToCustomerByAdmin(@RequestBody CustomerPlanReqDto customerPlanReqDto,
                                                         @PathVariable long customerId,
                                                         @PathVariable long planId){
        customerPlanService.buyPlan(customerId,planId,customerPlanReqDto);

        return ResponseEntity.status(HttpStatus.CREATED)
                .build();
    }

    // Get all customers under a plan
    @GetMapping("/customer/{planId}")
    public List<PlanCustomerDto> getCustomersByPlanId(@PathVariable long planId) {
        return customerPlanService.getCustomersByPlanId(planId);
    }
}