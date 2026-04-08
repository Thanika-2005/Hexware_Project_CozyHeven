package com.springboot.myapp.dto;

import com.springboot.myapp.enums.TicketPriority;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

public record TicketReqDto(
        @NotBlank(message = "subject cannot be blank")
        @NotNull
        @Size(min = 3, max = 255, message = "subject size is defined as 3-255")
        String subject,

        @NotBlank
        @NotNull
        @Size(min = 3, max = 1000)
        String details,

        TicketPriority ticketPriority

) {
}
