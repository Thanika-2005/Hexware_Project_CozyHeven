package com.springboot.myapp.dto;

import java.time.LocalDate;

public record PlanCustomerDto(
        Long customerId,
        String name,
        String email,
        String city,
        LocalDate start_date,
        LocalDate end_date,
        String planName
) {
}
