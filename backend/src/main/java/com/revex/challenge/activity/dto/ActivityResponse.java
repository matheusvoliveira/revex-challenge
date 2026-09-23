package com.revex.challenge.activity.dto;

import com.revex.challenge.activity.entity.Activity;
import com.revex.challenge.activity.entity.ActivityStatus;
import java.time.Instant;
import java.util.UUID;

public record ActivityResponse(
        UUID id,
        String title,
        String description,
        ActivityStatus status,
        ActivityCollaboratorResponse collaborator,
        Instant createdAt
) {

    public static ActivityResponse from(Activity activity) {
        return new ActivityResponse(
                activity.getId(),
                activity.getTitle(),
                activity.getDescription(),
                activity.getStatus(),
                ActivityCollaboratorResponse.from(activity.getCollaborator()),
                activity.getCreatedAt()
        );
    }
}
