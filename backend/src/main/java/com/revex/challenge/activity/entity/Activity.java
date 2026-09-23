package com.revex.challenge.activity.entity;

import com.revex.challenge.collaborator.entity.Collaborator;
import com.revex.challenge.shared.exception.BusinessRuleException;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.FetchType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import java.time.Instant;
import java.util.UUID;

@Entity
@Table(name = "activities")
public class Activity {

    @Id
    private UUID id;

    @Column(nullable = false, length = 2000)
    private String description;

    @ManyToOne(optional = false, fetch = FetchType.LAZY)
    @JoinColumn(name = "collaborator_id", nullable = false)
    private Collaborator collaborator;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ActivityStatus status;

    @Column(name = "created_at", nullable = false)
    private Instant createdAt;

    protected Activity() {
        // JPA
    }

    public static Activity create(String description, Collaborator collaborator) {
        Activity activity = new Activity();
        activity.id = UUID.randomUUID();
        activity.description = description;
        activity.collaborator = collaborator;
        activity.status = ActivityStatus.PENDENTE;
        activity.createdAt = Instant.now();
        return activity;
    }

    public void start() {
        if (status != ActivityStatus.PENDENTE) {
            throw new BusinessRuleException("Só é possível iniciar uma atividade pendente.");
        }
        this.status = ActivityStatus.EM_ANDAMENTO;
    }

    public void complete() {
        if (status == ActivityStatus.CONCLUIDA) {
            throw new BusinessRuleException("Não é possível concluir uma atividade já concluída.");
        }
        this.status = ActivityStatus.CONCLUIDA;
    }

    public void updateDescription(String description) {
        this.description = description;
    }

    public UUID getId() {
        return id;
    }

    public String getDescription() {
        return description;
    }

    public Collaborator getCollaborator() {
        return collaborator;
    }

    public ActivityStatus getStatus() {
        return status;
    }

    public Instant getCreatedAt() {
        return createdAt;
    }
}
