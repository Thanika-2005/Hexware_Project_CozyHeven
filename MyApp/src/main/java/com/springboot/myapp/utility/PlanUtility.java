package com.springboot.myapp.utility;

import org.springframework.stereotype.Component;

import java.time.LocalDate;

@Component
public class PlanUtility {
    public static LocalDate computeEndDate(LocalDate localDate, int days) {
        return localDate.plusDays(days);

        //plus day is like start date + rem days = total end days
    }
}
