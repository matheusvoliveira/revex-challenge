package com.revex.challenge.activity.dto;

import com.fasterxml.jackson.databind.JsonNode;
import com.revex.challenge.shared.exception.ApiErrorResponse;
import com.revex.challenge.shared.exception.InvalidRequestException;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

public final class UpdateActivityRequest {

    private static final Set<String> ALLOWED = Set.of("title", "description");
    private static final Set<String> FORBIDDEN = Set.of("status", "collaboratorId", "id", "createdAt", "collaborator");

    private final String title;
    private final String description;

    private UpdateActivityRequest(String title, String description) {
        this.title = title;
        this.description = description;
    }

    public static UpdateActivityRequest from(JsonNode body) {
        if (body == null || !body.isObject()) {
            throw new InvalidRequestException("Requisição inválida.");
        }

        List<String> fields = new ArrayList<>();
        body.fieldNames().forEachRemaining(fields::add);

        if (fields.stream().anyMatch(FORBIDDEN::contains) || fields.stream().anyMatch(field -> !ALLOWED.contains(field))) {
            throw new InvalidRequestException("Só é permitido alterar título e descrição.");
        }
        if (fields.isEmpty()) {
            throw new InvalidRequestException("Só é permitido alterar título e descrição.");
        }

        return new UpdateActivityRequest(
                optionalText(body, "title", "Título é obrigatório.", 100, "Título excede o limite de 100 caracteres."),
                optionalText(body, "description", "Descrição é obrigatória.", 1000, "Descrição excede o limite de 1000 caracteres.")
        );
    }

    public void applyTo(com.revex.challenge.activity.entity.Activity activity) {
        if (title != null) {
            activity.updateTitle(title);
        }
        if (description != null) {
            activity.updateDescription(description);
        }
    }

    private static String optionalText(
            JsonNode body,
            String field,
            String requiredMessage,
            int max,
            String maxMessage
    ) {
        if (!body.has(field)) {
            return null;
        }
        if (body.get(field).isNull() || !body.get(field).isTextual()) {
            throw new InvalidRequestException(
                    "Dados inválidos.",
                    List.of(new ApiErrorResponse.FieldError(field, requiredMessage))
            );
        }
        String value = body.get(field).asText().trim();
        if (value.isEmpty()) {
            throw new InvalidRequestException(
                    "Dados inválidos.",
                    List.of(new ApiErrorResponse.FieldError(field, requiredMessage))
            );
        }
        if (value.length() > max) {
            throw new InvalidRequestException(
                    "Dados inválidos.",
                    List.of(new ApiErrorResponse.FieldError(field, maxMessage))
            );
        }
        return value;
    }
}
