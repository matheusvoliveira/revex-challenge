package com.revex.challenge.collaborator.dto;

import jakarta.validation.constraints.Digits;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.PastOrPresent;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.Size;
import java.math.BigDecimal;
import java.time.LocalDate;

public record UpdateCollaboratorRequest(
        @NotBlank(message = "Nome completo é obrigatório.")
        @Size(max = 60, message = "Nome completo excede o limite de 60 caracteres.")
        String fullName,

        @NotBlank(message = "Cargo é obrigatório.")
        @Size(max = 30, message = "Cargo excede o limite de 30 caracteres.")
        String jobTitle,

        @NotBlank(message = "Setor é obrigatório.")
        @Size(max = 30, message = "Setor excede o limite de 30 caracteres.")
        String department,

        @NotNull(message = "Data de admissão é obrigatória.")
        @PastOrPresent(message = "Data de admissão não pode ser futura.")
        LocalDate admissionDate,

        @NotNull(message = "Salário é obrigatório.")
        @Positive(message = "Salário deve ser positivo.")
        @Digits(integer = 10, fraction = 2, message = "Salário deve ter no máximo duas casas decimais.")
        BigDecimal salary
) {
}
