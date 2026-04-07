package com.example.task.repository;

import com.example.task.enums.TaskStatus;
import com.example.task.model.Task;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

@Repository
public interface TaskRepository extends JpaRepository<Task, Long> {

    @Modifying
    @Transactional
    @Query("""
            update Task t
            SET t.taskStatus = ?1
            where t.id = ?2
            """)
    void updateStatus(TaskStatus taskStatus, long id);
}
