package com.springboot.myapp.dto;

import com.springboot.myapp.enums.TicketPriority;

public record FilterReqDto(
        String priority,
        String status
) {
}
