package com.example.task.dto;

import com.example.task.enums.TaskPriority;
import com.example.task.enums.TaskStatus;

import java.time.Instant;
import java.time.LocalDate;

public record TaskResDto (
    long id,
    String title,
    String description,
    LocalDate dueDate,
    TaskPriority priority,
    TaskStatus status

)
{}
