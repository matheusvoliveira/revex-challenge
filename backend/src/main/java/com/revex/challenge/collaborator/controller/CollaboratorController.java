package com.revex.challenge.collaborator.controller;

import com.revex.challenge.collaborator.dto.CollaboratorResponse;
import com.revex.challenge.collaborator.dto.CollaboratorSummaryResponse;
import com.revex.challenge.collaborator.dto.CreateCollaboratorRequest;
import com.revex.challenge.collaborator.dto.UpdateCollaboratorRequest;
import com.revex.challenge.collaborator.service.CollaboratorService;
import com.revex.challenge.shared.pagination.PageResponse;
import jakarta.validation.Valid;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import java.util.UUID;
import org.springframework.http.HttpStatus;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PatchMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;

@Validated
@RestController
@RequestMapping("/api/collaborators")
public class CollaboratorController {

    private final CollaboratorService collaboratorService;

    public CollaboratorController(CollaboratorService collaboratorService) {
        this.collaboratorService = collaboratorService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CollaboratorResponse create(@Valid @RequestBody CreateCollaboratorRequest request) {
        return collaboratorService.create(request);
    }

    @GetMapping
    public PageResponse<CollaboratorSummaryResponse> list(
            @RequestParam(required = false) String department,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size
    ) {
        return collaboratorService.list(department, page, size);
    }

    @GetMapping("/{id}")
    public CollaboratorResponse getById(@PathVariable UUID id) {
        return collaboratorService.getById(id);
    }

    @PatchMapping("/{id}")
    public CollaboratorResponse update(
            @PathVariable UUID id,
            @Valid @RequestBody UpdateCollaboratorRequest request
    ) {
        return collaboratorService.update(id, request);
    }
}
