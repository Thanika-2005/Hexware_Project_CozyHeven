package com.springboot.myapp.service;

import com.springboot.myapp.dto.CustomerPlanReqDto;
import com.springboot.myapp.dto.PlanCustomerDto;
import com.springboot.myapp.dto.PlanService;
import com.springboot.myapp.mapper.CustomerPlanMapper;
import com.springboot.myapp.model.Customer;
import com.springboot.myapp.model.CustomerPlan;
import com.springboot.myapp.model.Plan;
import com.springboot.myapp.repository.CustomerPlanRepository;
import com.springboot.myapp.utility.PlanUtility;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@AllArgsConstructor
public class CustomerPlanService {

    private final CustomerPlanRepository customerPlanRepository;
    private final CustomerService customerService;
    private final PlanService planService;
    private final PlanUtility planUtility;

    // Admin assigns plan
    public void buyPlan(long customerId, long planId, CustomerPlanReqDto customerPlanReqDto) {

        Customer customer = customerService.getById(customerId);
        Plan plan = planService.getById(planId);

        LocalDate endDate = planUtility.computeEndDate(customerPlanReqDto.start_date(), plan.getDays());

        CustomerPlan customerPlan = new CustomerPlan();
        customerPlan.setCustomer(customer);
        customerPlan.setPlan(plan);
        customerPlan.setStart_date(customerPlanReqDto.start_date());
        customerPlan.setCoupon(customerPlanReqDto.coupon());
        customerPlan.setDiscount(customerPlanReqDto.discount());
        customerPlan.setEnd_date(endDate);

        customerPlanRepository.save(customerPlan);
    }

    // Customer buys plan
    public void buyPlanByCustomer(String username, long planId, CustomerPlanReqDto customerPlanReqDto) {

        // Step 1: Fetch Customer by username
        Customer customer = customerService.getByUsername(username);
        // Step 2: fetch Plan by planId
        Plan plan = planService.getById(planId);
        // Step 3: To attach customer and plan to CustomerPlan object and compute missing fields
        LocalDate endDate =  planUtility.computeEndDate(customerPlanReqDto.start_date(), plan.getDays());
        CustomerPlan customerPlan = new CustomerPlan();
        customerPlan.setCustomer(customer);
        customerPlan.setPlan(plan);
        customerPlan.setStart_date(customerPlanReqDto.start_date());
        customerPlan.setCoupon(customerPlanReqDto.coupon());
        customerPlan.setDiscount(customerPlanReqDto.discount());
        customerPlan.setEnd_date(endDate);

        // Step 4: Save CustomerPlan object in DB
        customerPlanRepository.save(customerPlan);
    }

    // Fetch customers by plan
    public List<PlanCustomerDto> getCustomersByPlanId(long planId) {

        List<CustomerPlan> list = customerPlanRepository.getCustomerByPlanId(planId);

        return list.stream()
                .map(CustomerPlanMapper::mapPlanToCustomerDto)
                .toList();
    }
}