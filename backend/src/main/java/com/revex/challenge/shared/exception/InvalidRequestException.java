package com.revex.challenge.shared.exception;

import java.util.List;

public class InvalidRequestException extends RuntimeException {

    private final List<ApiErrorResponse.FieldError> fieldErrors;

    public InvalidRequestException(String message) {
        this(message, List.of());
    }

    public InvalidRequestException(String message, List<ApiErrorResponse.FieldError> fieldErrors) {
        super(message);
        this.fieldErrors = List.copyOf(fieldErrors);
    }

    public List<ApiErrorResponse.FieldError> getFieldErrors() {
        return fieldErrors;
    }
}
