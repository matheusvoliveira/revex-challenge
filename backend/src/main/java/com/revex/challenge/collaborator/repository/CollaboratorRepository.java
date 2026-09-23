package com.revex.challenge.collaborator.repository;

import com.revex.challenge.collaborator.entity.Collaborator;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CollaboratorRepository extends JpaRepository<Collaborator, UUID> {

    Page<Collaborator> findByDepartmentIgnoreCase(String department, Pageable pageable);
}
