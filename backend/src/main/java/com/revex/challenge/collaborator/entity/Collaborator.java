package com.revex.challenge.collaborator.entity;

import com.revex.challenge.shared.exception.BusinessRuleException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;
import java.util.UUID;

@Entity
@Table(name = "collaborators")
public class Collaborator {

    @Id
    private UUID id;

    @Column(name = "full_name", nullable = false, length = 255)
    private String fullName;

    @Column(name = "job_title", nullable = false, length = 255)
    private String jobTitle;

    @Column(name = "admission_date", nullable = false)
    private LocalDate admissionDate;

    @Column(nullable = false, length = 255)
    private String department;

    @Column(nullable = false, precision = 12, scale = 2)
    private BigDecimal salary;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected Collaborator() {
        // JPA
    }

    public static Collaborator create(
            String fullName,
            String jobTitle,
            LocalDate admissionDate,
            String department,
            BigDecimal salary
    ) {
        // Proteção de domínio além do Bean Validation: salário positivo é RN-E2.
        if (salary == null || salary.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessRuleException("Salário deve ser positivo.");
        }
        Collaborator collaborator = new Collaborator();
        collaborator.id = UUID.randomUUID();
        collaborator.fullName = fullName;
        collaborator.jobTitle = jobTitle;
        collaborator.admissionDate = admissionDate;
        collaborator.department = department;
        collaborator.salary = salary;
        collaborator.createdAt = Instant.now();
        return collaborator;
    }

    public void update(
            String fullName,
            String jobTitle,
            LocalDate admissionDate,
            String department,
            BigDecimal salary
    ) {
        if (salary == null || salary.compareTo(BigDecimal.ZERO) <= 0) {
            throw new BusinessRuleException("Salário deve ser positivo.");
        }
        this.fullName = fullName;
        this.jobTitle = jobTitle;
        this.admissionDate = admissionDate;
        this.department = department;
        this.salary = salary;
    }

    public UUID getId() {
        return id;
    }

    public String getFullName() {
        return fullName;
    }

    public String getJobTitle() {
        return jobTitle;
    }

    public LocalDate getAdmissionDate() {
        return admissionDate;
    }

    public String getDepartment() {
        return department;
    }

    public BigDecimal getSalary() {
        return salary;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
