-- Associação obrigatória com colaborador (RN-E6). Sem CASCADE: apagar colaborador não some atividade.
-- Status só nos três valores do enunciado. Sem completed_at/updated_at.
CREATE TABLE activities (
    id UUID PRIMARY KEY,
    description VARCHAR(2000) NOT NULL,
    collaborator_id UUID NOT NULL,
    status VARCHAR(20) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT activities_collaborator_fk
        FOREIGN KEY (collaborator_id) REFERENCES collaborators (id),
    CONSTRAINT activities_status_check
        CHECK (status IN ('PENDENTE', 'EM_ANDAMENTO', 'CONCLUIDA'))
);

CREATE INDEX idx_activities_collaborator_id ON activities (collaborator_id);
CREATE INDEX idx_activities_status ON activities (status);
