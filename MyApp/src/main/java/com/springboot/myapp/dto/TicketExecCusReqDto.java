package com.springboot.myapp.dto;

import com.springboot.myapp.enums.JobTitle;
import com.springboot.myapp.enums.TicketPriority;
import com.springboot.myapp.enums.TicketStatus;

import java.time.Instant;

public record TicketExecCusReqDto(
        long id,
        String subject,
        TicketStatus status,
        TicketPriority  priority,
        Instant createdAt,
        String customerName,
        String  executiveName,
        JobTitle executiveJobTitle
) {
}
