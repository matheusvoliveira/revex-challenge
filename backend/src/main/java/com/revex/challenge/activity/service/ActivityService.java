package com.revex.challenge.activity.service;

import com.revex.challenge.activity.dto.ActivityResponse;
import com.revex.challenge.activity.dto.CreateActivityRequest;
import com.revex.challenge.activity.entity.Activity;
import com.revex.challenge.activity.entity.ActivityStatus;
import com.revex.challenge.activity.repository.ActivityRepository;
import com.revex.challenge.collaborator.entity.Collaborator;
import com.revex.challenge.collaborator.service.CollaboratorService;
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
public class ActivityService {

    private final ActivityRepository activityRepository;
    private final CollaboratorService collaboratorService;

    public ActivityService(ActivityRepository activityRepository, CollaboratorService collaboratorService) {
        this.activityRepository = activityRepository;
        this.collaboratorService = collaboratorService;
    }

    @Transactional
    public ActivityResponse create(CreateActivityRequest request) {
        Collaborator collaborator = collaboratorService.requireById(request.collaboratorId());
        Activity activity = Activity.create(request.description().trim(), collaborator);
        return ActivityResponse.from(activityRepository.save(activity));
    }

    @Transactional(readOnly = true)
    public PageResponse<ActivityResponse> list(UUID collaboratorId, ActivityStatus status, int page, int size) {
        Pageable pageable = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        Page<Activity> result;
        if (collaboratorId != null && status != null) {
            result = activityRepository.findByCollaborator_IdAndStatus(collaboratorId, status, pageable);
        } else if (collaboratorId != null) {
            result = activityRepository.findByCollaborator_Id(collaboratorId, pageable);
        } else if (status != null) {
            result = activityRepository.findByStatus(status, pageable);
        } else {
            result = activityRepository.findAll(pageable);
        }
        return PageResponse.from(result.map(ActivityResponse::from));
    }

    @Transactional
    public ActivityResponse start(UUID id) {
        Activity activity = requireById(id);
        activity.start();
        return ActivityResponse.from(activityRepository.save(activity));
    }

    @Transactional
    public ActivityResponse complete(UUID id) {
        Activity activity = requireById(id);
        activity.complete();
        return ActivityResponse.from(activityRepository.save(activity));
    }

    private Activity requireById(UUID id) {
        return activityRepository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException("Atividade não encontrada."));
    }
}
