package com.revex.challenge.activity.controller;

import com.revex.challenge.activity.dto.ActivityResponse;
import com.revex.challenge.activity.dto.CreateActivityRequest;
import com.revex.challenge.activity.entity.ActivityStatus;
import com.revex.challenge.activity.service.ActivityService;
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
@RequestMapping("/api/activities")
public class ActivityController {

    private final ActivityService activityService;

    public ActivityController(ActivityService activityService) {
        this.activityService = activityService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public ActivityResponse create(@Valid @RequestBody CreateActivityRequest request) {
        return activityService.create(request);
    }

    @GetMapping
    public PageResponse<ActivityResponse> list(
            @RequestParam(required = false) UUID collaboratorId,
            @RequestParam(required = false) ActivityStatus status,
            @RequestParam(defaultValue = "0") @Min(0) int page,
            @RequestParam(defaultValue = "10") @Min(1) @Max(100) int size
    ) {
        return activityService.list(collaboratorId, status, page, size);
    }

    @PatchMapping("/{id}/start")
    public ActivityResponse start(@PathVariable UUID id) {
        return activityService.start(id);
    }

    @PatchMapping("/{id}/complete")
    public ActivityResponse complete(@PathVariable UUID id) {
        return activityService.complete(id);
    }
}
