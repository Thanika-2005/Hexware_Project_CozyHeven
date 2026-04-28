package com.springBoot.cozyheven.repository;

import com.springBoot.cozyheven.model.Document;
import org.springframework.data.jpa.repository.JpaRepository;

public interface DocumentRepository extends JpaRepository<Document,Long> {
}
