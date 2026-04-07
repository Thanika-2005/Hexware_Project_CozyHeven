package com.example.task.service;

import com.example.task.dto.TaskResDto;
import com.example.task.enums.TaskPriority;
import com.example.task.enums.TaskStatus;
import com.example.task.exception.ResourceNotFoundException;
import com.example.task.model.Task;
import com.example.task.repository.TaskRepository;
import org.junit.jupiter.api.Assertions;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.Mockito;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.time.Instant;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import static org.mockito.Mockito.times;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
public class TaskServiceTest {
    @InjectMocks
    private TaskService taskService;
    @Mock
    private TaskRepository taskRepository;


    @Test
    public void getTaskByIdWhenExits(){
        // Check if ticketService is not null
        Assertions.assertNotNull(taskService);


        //Preparing the data for mock
        Task task = new Task();
        task.setId(1L);
        task.setTitle("test title");
        task.setTaskPriority(TaskPriority.HIGH);
        task.setTaskStatus(TaskStatus.IN_PROGRESS);
        task.setDueDate(LocalDate.now());


        // Actual Mocking: if any when you encounter a call  ticketRepository.findById(12L)
        // must return this above ticket object instead of going to DB
        // this is virtual record used only for testing purpose
        when(taskRepository.findById(1L)).thenReturn(Optional.of(task));


        //Prepare the DTO for above ticket object
        // So we know that DTO is getting prepared properly in our actual service class too.
        TaskResDto dto = new TaskResDto(
                task.getId(),
                task.getTitle(),
                task.getDescription(),
                task.getDueDate(),
                task.getTaskPriority(),
                task.getTaskStatus()

        );



        //   Mockito.when(ticketRepository.findById(12L)).thenReturn(Optional.of(ticket));
        Assertions.assertEquals(dto, taskService.getById(1));



        Mockito.verify(taskRepository,times(1)).findById(1L);
    }

    @Test
    public void getTaskByWhenNotFound(){
        when(taskRepository.findById(10L)).thenReturn(Optional.empty());

        Exception e  = Assertions.assertThrows(ResourceNotFoundException.class ,() ->{
            taskService.getById(10L);
        });

        Assertions.assertEquals("Invalid id given", e.getMessage());
    }
    @Test
    public void getAllTaskTest() {
        /* Prepare the List. */
        Task task = new Task();
        task.setId(1L);
        task.setTitle("test title");
        task.setTaskPriority(TaskPriority.HIGH);
        task.setTaskStatus(TaskStatus.IN_PROGRESS);
        task.setDueDate(LocalDate.now());

        Task task1 = new Task();
        task1.setId(1L);
        task1.setTitle("test title");
        task1.setTaskPriority(TaskPriority.LOW);
        task1.setTaskStatus(TaskStatus.COMPLETED);
        task1.setDueDate(LocalDate.now());

        List<Task> list = List.of(task, task1);


        Page<Task> ticketPage = new PageImpl<>(list);
        int page = 0;
        int size = 2;

        Pageable pageable = PageRequest.of(page, size);
        // Mock the repository call for findALL()
        when(taskRepository.findAll(pageable)).thenReturn(ticketPage);  // pageable for size 2

        Page<Task> ticketPage1 = new PageImpl<>(list.subList(0,1));
        page = 0;
        size = 1;

        Pageable pageable1 = PageRequest.of(page, size);

        // Mock the repository call for findALL()
//        when(ticketRepository.findAll(pageable1)).thenReturn(ticketPage1);  // pageable for size 1



        // Actual Call  (call only 1 ) which page , size you need
        Assertions.assertEquals(2,taskService.getAllTasks(0,2).data().size());
//        Assertions.assertEquals(1,ticketService.getAllTickets(0,1).data().size());

    }

}
