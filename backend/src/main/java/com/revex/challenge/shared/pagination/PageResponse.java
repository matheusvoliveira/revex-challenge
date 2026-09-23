package com.revex.challenge.shared.pagination;

import java.util.List;
import org.springframework.data.domain.Page;

/**
 * Contrato próprio de paginação (bônus C-03).
 * Não expõe Page do Spring no JSON.
 */
public record PageResponse<T>(
        List<T> content,
        int page,
        int size,
        long totalElements,
        int totalPages
) {

    public static <T> PageResponse<T> from(Page<T> page) {
        return new PageResponse<>(
                page.getContent(),
                page.getNumber(),
                page.getSize(),
                page.getTotalElements(),
                page.getTotalPages()
        );
    }
}
