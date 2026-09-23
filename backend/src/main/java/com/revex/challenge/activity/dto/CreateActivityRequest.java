package com.revex.challenge.activity.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Size;
import java.util.UUID;

public record CreateActivityRequest(
        @NotBlank(message = "Título é obrigatório.")
        @Size(max = 100, message = "Título excede o limite de 100 caracteres.")
        String title,

        @NotBlank(message = "Descrição é obrigatória.")
        @Size(max = 1000, message = "Descrição excede o limite de 1000 caracteres.")
        String description,

        @NotNull(message = "Colaborador é obrigatório.")
        UUID collaboratorId
) {
}
