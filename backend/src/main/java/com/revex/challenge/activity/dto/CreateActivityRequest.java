package com.revex.challenge.activity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CreateActivityRequest(
        @NotBlank(message = "Descrição é obrigatória.")
        @Size(max = 2000, message = "Descrição excede o limite técnico de 2000 caracteres.")
        String description,

        @NotNull(message = "Colaborador é obrigatório.")
        UUID collaboratorId
) {
}
