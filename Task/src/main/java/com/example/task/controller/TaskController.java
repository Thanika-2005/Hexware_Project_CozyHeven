package com.example.task.controller;


import com.example.task.dto.TaskPageResDto;
import com.example.task.dto.TaskReqDto;
import com.example.task.dto.TaskResDto;
import com.example.task.enums.TaskStatus;
import com.example.task.service.TaskService;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.security.Principal;

@RestController
@RequestMapping("/api/task")
@AllArgsConstructor
public class TaskController {

    private final TaskService taskService;

    @PostMapping("/addtask")
    public ResponseEntity<?> addtask(@Valid @RequestBody TaskReqDto taskReqDto){
        taskService.addtask(taskReqDto);
        return ResponseEntity.status(HttpStatus.CREATED)
                .build();
    }

    @GetMapping("/get-all")
    public TaskPageResDto getAllTasks(@RequestParam(value = "page", required = false, defaultValue = " 0") int page
                                    ,@RequestParam(value = "size", required = false, defaultValue = " 5") int size ){
        return taskService.getAllTasks(page,size);
    }

    @GetMapping("/get/{id}")
    public TaskResDto getByid(@PathVariable long id){
        return taskService.getById(id);
    }

    @PutMapping("/update/status/{id}")
    public ResponseEntity<?> updateStatus(@PathVariable long id,
                                          @RequestParam TaskStatus taskStatus,
                                          Principal principal) {
        taskService.updateStatus(id, taskStatus, principal.getName());
        return ResponseEntity.status(HttpStatus.OK).build();
    }
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<?> deleteTask(@PathVariable long id) {
        taskService.deleteTask(id);
        return ResponseEntity.status(HttpStatus.OK).build();
    }

}
