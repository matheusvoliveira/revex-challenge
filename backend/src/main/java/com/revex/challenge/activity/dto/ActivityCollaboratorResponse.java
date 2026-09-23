package com.revex.challenge.activity.dto;

import com.revex.challenge.collaborator.entity.Collaborator;
import java.util.UUID;

public record ActivityCollaboratorResponse(
        UUID id,
        String fullName
) {

    public static ActivityCollaboratorResponse from(Collaborator collaborator) {
        return new ActivityCollaboratorResponse(collaborator.getId(), collaborator.getFullName());
    }
}
