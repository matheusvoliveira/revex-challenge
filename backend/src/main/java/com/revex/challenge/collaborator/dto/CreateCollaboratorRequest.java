package com.revex.challenge.collaborator.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateCollaboratorRequest(
        @NotBlank(message = "Nome completo é obrigatório.")
        @Size(max = 255, message = "Nome completo excede o limite técnico de 255 caracteres.")
        String fullName,

        @NotBlank(message = "Cargo é obrigatório.")
        @Size(max = 255, message = "Cargo excede o limite técnico de 255 caracteres.")
        String jobTitle,

        @NotBlank(message = "Setor é obrigatório.")
        @Size(max = 255, message = "Setor excede o limite técnico de 255 caracteres.")
        String department,

        @NotNull(message = "Data de admissão é obrigatória.")
        LocalDate admissionDate,

        @NotNull(message = "Salário é obrigatório.")
        @Positive(message = "Salário deve ser positivo.")
        @Digits(integer = 10, fraction = 2, message = "Salário deve ter no máximo duas casas decimais.")
        BigDecimal salary
) {
}
