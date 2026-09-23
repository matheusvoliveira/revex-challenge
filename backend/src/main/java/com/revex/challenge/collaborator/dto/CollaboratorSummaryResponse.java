package com.revex.challenge.collaborator.dto;

import com.revex.challenge.collaborator.entity.Collaborator;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.UUID;

public record CollaboratorSummaryResponse(
        UUID id,
        String fullName,
        String jobTitle,
        String department,
        LocalDate admissionDate,
        BigDecimal salary
) {

    public static CollaboratorSummaryResponse from(Collaborator collaborator) {
        return new CollaboratorSummaryResponse(
                collaborator.getId(),
                collaborator.getFullName(),
                collaborator.getJobTitle(),
                collaborator.getDepartment(),
                collaborator.getAdmissionDate(),
                collaborator.getSalary()
        );
    }
}
