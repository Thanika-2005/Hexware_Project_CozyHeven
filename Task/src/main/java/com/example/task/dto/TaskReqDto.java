package com.example.task.dto;

import com.example.task.enums.TaskPriority;
import com.example.task.enums.TaskStatus;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;

import java.time.LocalDate;

public record TaskReqDto(
        @NotBlank(message = "title cannot be blank")
        @NotNull
        @Size(min = 3, max = 255, message = "title size is defined as 3-255")
        String title,

        @NotBlank
        @NotNull
        @Size(min = 3, max = 1000)
        String description,

        @NotNull
        LocalDate dueDate,

        TaskPriority taskPriority,
        TaskStatus taskStatus
) {
}
