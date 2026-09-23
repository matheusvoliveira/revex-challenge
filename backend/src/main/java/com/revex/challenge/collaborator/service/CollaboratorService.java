package com.revex.challenge.collaborator.service;

import com.revex.challenge.collaborator.dto.CollaboratorResponse;
import com.revex.challenge.collaborator.dto.CollaboratorSummaryResponse;
import com.revex.challenge.collaborator.dto.CreateCollaboratorRequest;
import com.revex.challenge.collaborator.entity.Collaborator;
import com.revex.challenge.collaborator.repository.CollaboratorRepository;
import com.revex.challenge.shared.exception.ResourceNotFoundException;
import com.revex.challenge.shared.pagination.PageResponse;
import java.util.UUID;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class CollaboratorService {

    private final CollaboratorRepository collaboratorRepository;

    public CollaboratorService(CollaboratorRepository collaboratorRepository) {
        this.collaboratorRepository = collaboratorRepository;
    }

    @Transactional
    public CollaboratorResponse create(CreateCollaboratorRequest request) {
        Collaborator collaborator = Collaborator.create(
                request.fullName().trim(),
                request.jobTitle().trim(),
                request.admissionDate(),
                request.department().trim(),
                request.salary()
        );
        return CollaboratorResponse.from(collaboratorRepository.save(collaborator));
    }

    @Transactional(readOnly = true)
    public PageResponse<CollaboratorSummaryResponse> list(String department, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Collaborator> result;
        if (department == null || department.isBlank()) {
            result = collaboratorRepository.findAll(pageable);
        } else {
            // Filtro case-insensitive (decisão técnica). Não é catálogo de setores.
            result = collaboratorRepository.findByDepartmentIgnoreCase(department.trim(), pageable);
        }
        return PageResponse.from(result.map(CollaboratorSummaryResponse::from));
    }

    @Transactional(readOnly = true)
    public CollaboratorResponse getById(UUID id) {
        return CollaboratorResponse.from(requireById(id));
    }

    /**
     * Ponto público para o módulo activity (S3). Nunca expor o repository.
     */
    @Transactional(readOnly = true)
    public Collaborator requireById(UUID id) {
        return collaboratorRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Colaborador não encontrado."));
    }
}
