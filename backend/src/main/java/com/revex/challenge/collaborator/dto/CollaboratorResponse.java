package com.revex.challenge.collaborator.dto;

import com.revex.challenge.collaborator.entity.Collaborator;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

public record CollaboratorResponse(
        UUID id,
        String fullName,
        String jobTitle,
        String department,
        LocalDate admissionDate,
        BigDecimal salary,
        Instant createdAt
) {

    public static CollaboratorResponse from(Collaborator collaborator) {
        return new CollaboratorResponse(
                collaborator.getId(),
                collaborator.getFullName(),
                collaborator.getJobTitle(),
                collaborator.getDepartment(),
                collaborator.getAdmissionDate(),
                collaborator.getSalary(),
                collaborator.getCreatedAt()
        );
    }
}
