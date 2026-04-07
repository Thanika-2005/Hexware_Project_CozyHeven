    package com.example.task.service;

    import com.example.task.dto.TaskPageResDto;
    import com.example.task.dto.TaskReqDto;
    import com.example.task.dto.TaskResDto;
    import com.example.task.enums.Role;
    import com.example.task.enums.TaskStatus;
    import com.example.task.exception.ResourceNotFoundException;
    import com.example.task.exception.TaskUpdatePermissionException;
    import com.example.task.mapper.TaskMapper;
    import com.example.task.model.Task;
    import com.example.task.model.User;
    import com.example.task.repository.TaskRepository;
    import jakarta.persistence.criteria.CriteriaBuilder;
    import jakarta.validation.Valid;
    import lombok.AllArgsConstructor;
    import org.springframework.data.domain.Page;
    import org.springframework.data.domain.PageRequest;
    import org.springframework.data.domain.Pageable;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;

    import java.util.List;

    @Service
    @AllArgsConstructor

    public class TaskService {
        private final TaskRepository taskRepository;
        private final UserService userService;

        public void addtask(@Valid TaskReqDto taskReqDto) {

            // dtp to entity
            Task task = TaskMapper.maptoEntity(taskReqDto);
            // save in db
            taskRepository.save(task);

        }

        public TaskPageResDto getAllTasks(int page, int size) {
            Pageable pageable = PageRequest.of(page, size);
            Page<Task> taskPage = taskRepository.findAll(pageable);
            long TotalRecords = taskPage.getTotalElements();
            int TotalPages= taskPage.getTotalPages();

            List<TaskResDto> list = taskPage.toList()
                    .stream()
                    .map(TaskMapper::mapToDto)
                    .toList();

            return  new TaskPageResDto(
                    list,
                    TotalRecords,
                    TotalPages
            );
        }

        public TaskResDto getById(long id) {
            Task task = taskRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Invalid id given"));
            return new TaskResDto(
                    task.getId(),
                    task.getTitle(),
                    task.getDescription(),
                    task.getDueDate(),
                    task.getTaskPriority(),
                    task.getTaskStatus()
            );
        }


        public void updateStatus(long id, TaskStatus taskStatus, String loggedInUsername) {
            Task task = taskRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Task not found"));

            User user = (User) userService.loadUserByUsername(loggedInUsername);

            if (user.getRole().equals(Role.TASK_MANAGER)) {
                if (task.getManager().getUser().getId() != user.getId())
                    throw new TaskUpdatePermissionException("Manager does not own this task");
            }

            taskRepository.updateStatus(taskStatus, id);
        }


        public void deleteTask(long id) {
            taskRepository.findById(id)
                    .orElseThrow(() -> new ResourceNotFoundException("Task not found"));
            taskRepository.deleteById(id);
        }


    }
