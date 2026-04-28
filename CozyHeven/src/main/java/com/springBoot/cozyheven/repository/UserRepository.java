package com.springBoot.cozyheven.repository;

import com.springBoot.cozyheven.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;


public interface UserRepository extends JpaRepository<User,Long> {
    @Query("""
            select u from User u where u.username =?1
            """)
    User getUserByUsername(String username);


}
