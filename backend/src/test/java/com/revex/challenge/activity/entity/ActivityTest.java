package com.revex.challenge.activity.entity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.revex.challenge.collaborator.entity.Collaborator;
import com.revex.challenge.shared.exception.BusinessRuleException;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class ActivityTest {

    @Test
    void create_startsPending() {
        Activity activity = Activity.create("Preparar relatório", collaborator());

        assertThat(activity.getId()).isNotNull();
        assertThat(activity.getStatus()).isEqualTo(ActivityStatus.PENDENTE);
        assertThat(activity.getCreatedAt()).isNotNull();
        assertThat(activity.getCollaborator().getFullName()).isEqualTo("Ana Silva");
    }

    @Test
    void start_movesPendingToInProgress() {
        Activity activity = Activity.create("Preparar relatório", collaborator());

        activity.start();

        assertThat(activity.getStatus()).isEqualTo(ActivityStatus.EM_ANDAMENTO);
    }

    @Test
    void start_rejectsWhenAlreadyInProgress() {
        Activity activity = Activity.create("Preparar relatório", collaborator());
        activity.start();

        assertThatThrownBy(activity::start)
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("Só é possível iniciar uma atividade pendente.");
    }

    @Test
    void start_rejectsWhenCompleted() {
        Activity activity = Activity.create("Preparar relatório", collaborator());
        activity.complete();

        assertThatThrownBy(activity::start)
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("Só é possível iniciar uma atividade pendente.");
    }

    @Test
    void complete_fromPending() {
        Activity activity = Activity.create("Preparar relatório", collaborator());

        activity.complete();

        assertThat(activity.getStatus()).isEqualTo(ActivityStatus.CONCLUIDA);
    }

    @Test
    void complete_fromInProgress() {
        Activity activity = Activity.create("Preparar relatório", collaborator());
        activity.start();

        activity.complete();

        assertThat(activity.getStatus()).isEqualTo(ActivityStatus.CONCLUIDA);
    }

    @Test
    void complete_rejectsSecondConclusion() {
        Activity activity = Activity.create("Preparar relatório", collaborator());
        activity.complete();

        assertThatThrownBy(activity::complete)
                .isInstanceOf(BusinessRuleException.class)
                .hasMessage("Não é possível concluir uma atividade já concluída.");
    }

    @Test
    void updateDescription_onCompletedKeepsStatusAndCollaborator() {
        Collaborator owner = collaborator();
        Activity activity = Activity.create("Texto antigo", owner);
        activity.complete();

        activity.updateDescription("Texto novo");

        assertThat(activity.getDescription()).isEqualTo("Texto novo");
        assertThat(activity.getStatus()).isEqualTo(ActivityStatus.CONCLUIDA);
        assertThat(activity.getCollaborator()).isSameAs(owner);
    }

    private static Collaborator collaborator() {
        return Collaborator.create(
                "Ana Silva",
                "Analista",
                LocalDate.of(2024, 1, 15),
                "TI",
                new BigDecimal("3500.50")
        );
    }
}
