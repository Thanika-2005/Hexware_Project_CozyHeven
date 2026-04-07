package com.example.task.repository;

import com.example.task.model.Manager;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface ManagerRepository extends JpaRepository<Manager, Long> {
    @Query("""
            select m from Manager m
            where m.User.username = ?1
            """)
    Manager getByUsername(String username);
}
