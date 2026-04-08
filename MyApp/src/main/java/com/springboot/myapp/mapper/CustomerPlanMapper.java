package com.springboot.myapp.mapper;

import com.springboot.myapp.dto.PlanCustomerDto;
import com.springboot.myapp.model.CustomerPlan;
import com.springboot.myapp.model.Ticket;

public class CustomerPlanMapper {
    public static PlanCustomerDto mapPlanToCustomerDto(CustomerPlan customerPlan) {
        return new PlanCustomerDto(
                customerPlan.getCustomer().getId(),
                customerPlan.getCustomer().getName(),
                customerPlan.getCustomer().getEmail(),
                customerPlan.getCustomer().getCity(),
                customerPlan.getStart_date(),
                customerPlan.getEnd_date(),
                customerPlan.getPlan().getPlanName()

        );

    }


}
