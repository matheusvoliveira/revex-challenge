-- Teto varchar/numeric é decisão técnica de armazenamento, não regra de RH.
-- salary > 0 é o requisito explícito da Revex (RN-E2).
CREATE TABLE collaborators (
    id UUID PRIMARY KEY,
    full_name VARCHAR(255) NOT NULL,
    job_title VARCHAR(255) NOT NULL,
    admission_date DATE NOT NULL,
    department VARCHAR(255) NOT NULL,
    salary NUMERIC(12, 2) NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    CONSTRAINT collaborators_salary_positive CHECK (salary > 0)
);

-- Índice para o filtro por setor (RN-E3). Comparação case-insensitive fica na query.
CREATE INDEX idx_collaborators_department ON collaborators (department);
