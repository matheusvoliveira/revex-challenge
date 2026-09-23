package com.revex.challenge.shared.exception;

import java.time.Instant;
import java.util.List;

public record ApiErrorResponse(
        Instant timestamp,
        int status,
        String message,
        List<FieldError> fieldErrors
) {

    public record FieldError(String field, String message) {
    }

    public static ApiErrorResponse of(int status, String message, List<FieldError> fieldErrors) {
        return new ApiErrorResponse(Instant.now(), status, message, fieldErrors);
    }

    public static ApiErrorResponse of(int status, String message) {
        return of(status, message, List.of());
    }
}
