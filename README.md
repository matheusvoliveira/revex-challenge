# Revex Challenge

Cadastro de colaboradores e atividades. Desafio técnico Full Stack (Java / Spring Boot + React).

Planning: [docs/PLANNING.md](docs/PLANNING.md). Regras: [PROJECT_RULES.md](PROJECT_RULES.md).

## Stack

- Java 21, Spring Boot 3.5, Maven, Flyway
- React, TypeScript, Vite
- PostgreSQL 16 (Docker Compose)

Não há JDK nesta máquina. Build/run do backend usa a imagem `maven:3.9-eclipse-temurin-21`. Com Java 21 + Maven locais, os mesmos `mvn` funcionam direto em `backend/`.

## Como executar

```bash
# 1. Banco
docker compose up -d db

# 2. API (porta 8080)
docker run --rm --network host \
  -v "$PWD/backend":/app -w /app \
  maven:3.9-eclipse-temurin-21 \
  mvn spring-boot:run

# 3. UI (porta 5173)
cd frontend && npm install && npm run dev
```

## Como testar (Sprint 0)

```bash
docker compose up -d db

docker run --rm --network host \
  -v "$PWD/backend":/app -w /app \
  maven:3.9-eclipse-temurin-21 \
  mvn -DskipTests package

cd frontend && npm run build && npm run lint
```

Testes de domínio entram nas Sprints 1+. Sem H2.

## Variáveis

Ver `.env.example`. Padrão local: banco `revex` / usuário `revex` / senha `revex`.

JWT (S6): `JWT_SECRET` e `JWT_EXPIRATION_SECONDS`. Login de demonstração: usuário `revex`, senha `revex`. A senha no banco é só hash BCrypt.
