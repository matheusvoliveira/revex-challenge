package com.revex.challenge.collaborator.entity;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import com.revex.challenge.shared.exception.BusinessRuleException;
import java.math.BigDecimal;
import java.time.LocalDate;
import org.junit.jupiter.api.Test;

class CollaboratorTest {

    @Test
    void create_persistsPositiveSalaryAndGeneratedId() {
        Collaborator collaborator = Collaborator.create(
                "Ana Silva",
                "Analista",
                LocalDate.of(2024, 1, 15),
                "TI",
                new BigDecimal("3500.50")
        );

        assertThat(collaborator.getId()).isNotNull();
        assertThat(collaborator.getSalary()).isEqualByComparingTo("3500.50");
        assertThat(collaborator.getCreatedAt()).isNotNull();
    }

    @Test
    void create_rejectsZeroSalary() {
        assertThatThrownBy(() -> Collaborator.create(
                "Ana Silva",
                "Analista",
                LocalDate.of(2024, 1, 15),
                "TI",
                BigDecimal.ZERO
        )).isInstanceOf(BusinessRuleException.class)
                .hasMessage("Salário deve ser positivo.");
    }

    @Test
    void create_rejectsNegativeSalary() {
        assertThatThrownBy(() -> Collaborator.create(
                "Ana Silva",
                "Analista",
                LocalDate.of(2024, 1, 15),
                "TI",
                new BigDecimal("-1.00")
        )).isInstanceOf(BusinessRuleException.class);
    }
}
