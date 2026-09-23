package com.revex.challenge.activity.repository;

import com.revex.challenge.activity.entity.Activity;
import com.revex.challenge.activity.entity.ActivityStatus;
import java.util.Optional;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ActivityRepository extends JpaRepository<Activity, UUID> {

    @Override
    @EntityGraph(attributePaths = "collaborator")
    Optional<Activity> findById(UUID id);

    @Override
    @EntityGraph(attributePaths = "collaborator")
    Page<Activity> findAll(Pageable pageable);

    @EntityGraph(attributePaths = "collaborator")
    Page<Activity> findByCollaborator_Id(UUID collaboratorId, Pageable pageable);

    @EntityGraph(attributePaths = "collaborator")
    Page<Activity> findByStatus(ActivityStatus status, Pageable pageable);

    @EntityGraph(attributePaths = "collaborator")
    Page<Activity> findByCollaborator_IdAndStatus(UUID collaboratorId, ActivityStatus status, Pageable pageable);
}
