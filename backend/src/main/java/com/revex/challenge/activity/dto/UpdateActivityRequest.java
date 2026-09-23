package com.revex.challenge.activity.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.revex.challenge.shared.exception.ApiErrorResponse;
import com.revex.challenge.shared.exception.InvalidRequestException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public final class UpdateActivityRequest {

    private static final Set<String> FORBIDDEN = Set.of("status", "collaboratorId", "id", "createdAt", "collaborator");

    private UpdateActivityRequest() {
    }

    public static String descriptionFrom(JsonNode body) {
        if (body == null || !body.isObject()) {
            throw new InvalidRequestException("Requisição inválida.");
        }

        List<String> fields = new ArrayList<>();
        body.fieldNames().forEachRemaining(fields::add);

        if (fields.stream().anyMatch(FORBIDDEN::contains) || fields.stream().anyMatch(field -> !field.equals("description"))) {
            throw new InvalidRequestException("Só é permitido alterar a descrição.");
        }

        if (!body.has("description") || body.get("description").isNull() || !body.get("description").isTextual()) {
            throw new InvalidRequestException(
                    "Dados inválidos.",
                    List.of(new ApiErrorResponse.FieldError("description", "Descrição é obrigatória."))
            );
        }

        String description = body.get("description").asText().trim();
        if (description.isEmpty()) {
            throw new InvalidRequestException(
                    "Dados inválidos.",
                    List.of(new ApiErrorResponse.FieldError("description", "Descrição é obrigatória."))
            );
        }
        if (description.length() > 2000) {
            throw new InvalidRequestException(
                    "Dados inválidos.",
                    List.of(new ApiErrorResponse.FieldError(
                            "description",
                            "Descrição excede o limite técnico de 2000 caracteres."
                    ))
            );
        }
        return description;
    }
}
