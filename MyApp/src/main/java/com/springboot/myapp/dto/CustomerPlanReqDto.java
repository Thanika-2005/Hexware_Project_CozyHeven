package com.springboot.myapp.dto;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CustomerPlanReqDto(
        LocalDate start_date,
        BigDecimal discount,
        String coupon
) {
}
