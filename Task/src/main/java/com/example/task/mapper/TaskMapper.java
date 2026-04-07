package com.example.task.mapper;

import com.example.task.dto.TaskPageResDto;
import com.example.task.dto.TaskReqDto;
import com.example.task.dto.TaskResDto;
import com.example.task.model.Task;
import jakarta.validation.Valid;

public class TaskMapper {
    public static Task maptoEntity(TaskReqDto taskReqDto) {
        Task task = new Task();
        task.setTitle(taskReqDto.title());
        task.setDescription(taskReqDto.description());
        task.setDueDate(taskReqDto.dueDate());
        task.setTaskPriority(taskReqDto.taskPriority());
        task.setTaskStatus(taskReqDto.taskStatus());
        return task;
    }

    public static TaskResDto mapToDto(Task task) {
        return new TaskResDto(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getTaskPriority(),
                task.getTaskStatus()
        );
    }
}
