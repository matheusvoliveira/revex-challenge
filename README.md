# Revex Challenge

Aplicação web para cadastro de **colaboradores** e **atividades**. Desafio técnico Full Stack da Revex.

Não é WFM nem ERP. O núcleo é: cadastrar pessoas, associar atividades a elas, filtrar, iniciar, concluir e editar o texto da atividade.

Planning técnico: [docs/PLANNING.md](docs/PLANNING.md).

---

## Como executar (Docker)

Pré-requisitos: **Docker** e **Docker Compose**.

Java, Maven e Node **não** são necessários para rodar a aplicação.

```bash
docker compose up --build
```

Abra [http://localhost:3000](http://localhost:3000).

O Compose sobe três serviços:

```text
Browser  →  localhost:3000
               │
               ▼
         frontend (Nginx :80)
               │  /api → proxy
               ▼
         backend (Spring Boot :8080)
               │
               ▼
         PostgreSQL 16 (:5432, só na rede Docker)
```

- Host publica **somente a porta 3000**.
- Nginx serve o frontend e encaminha `/api` para o backend.
- Backend conecta no banco pelo hostname do serviço `db`, não por `localhost`.
- Flyway aplica as migrations no boot (incluindo o usuário de demonstração).

Aguarde os três serviços ficarem `healthy` (`docker compose ps`). O backend espera o Postgres; o frontend espera o backend.

### Parar

```bash
docker compose down
```

### Resetar o banco

```bash
docker compose down -v
```

`-v` remove o volume `revex_pg`. Todos os dados persistidos são apagados. Na próxima subida o Flyway recria o schema e o usuário demo.

### Credenciais de demonstração

| Campo | Valor |
| --- | --- |
| Usuário | `revex` |
| Senha | `revex` |

São credenciais do desafio (seed Flyway V3). A senha no banco é só o hash BCrypt.

### Variáveis

O Compose já usa defaults de demo. Ver [.env.example](.env.example).

| Variável | Default | Uso |
| --- | --- | --- |
| `POSTGRES_DB` / `USER` / `PASSWORD` | `revex` | Banco do container `db` |
| `SPRING_DATASOURCE_URL` | `jdbc:postgresql://db:5432/revex` | Backend no Compose |
| `JWT_SECRET` | `local-dev-only-secret-min-32-bytes-ok` | Assinatura HS256 (≥ 32 bytes) |
| `JWT_EXPIRATION_SECONDS` | `28800` | 8 horas |

Copie `.env.example` para `.env` só se quiser sobrescrever. Não commite secrets reais. `.env` está no `.gitignore`.

---

## O que o sistema faz

### Autenticação

- Login em `/login`.
- JWT HS256 no header `Authorization: Bearer …`.
- Token no `sessionStorage`. Sem refresh token, sem cadastro, sem RBAC.
- `POST /api/auth/login` é público. O restante da API exige autenticação.
- Sem token, a UI redireciona para `/login`. 401 fora do login limpa o token e volta ao login.
- `User` ≠ `Collaborator`. O usuário `revex` só autentica; colaboradores são outra entidade.

### Dashboard (`/`)

Totais e atividades recentes, lidos das APIs já existentes (`GET /api/collaborators` e `GET /api/activities`). Sem endpoint extra.

### Colaboradores

- Cadastrar: nome completo, cargo, setor, data de admissão, salário.
- Listar e filtrar por setor.
- Ver detalhe (todos os campos do cadastro).
- Editar o cadastro (mesmos cinco campos).

Regras:

- Campos obrigatórios após trim.
- Nome ≤ 60, cargo ≤ 30, setor ≤ 30.
- Setor é **String** (não há enum, tabela ou CRUD de setores).
- Data de admissão: hoje ou passado. O formulário bloqueia futuro e envia a data do dia como padrão.
- Salário > 0, até duas casas decimais. A UI mascara em reais (`R$ 1.234,56`) e a API recebe número (`1234.56`).

### Atividades

- Cadastrar com título, descrição e colaborador. Nasce `PENDENTE`.
- Listar e filtrar por colaborador e/ou status.
- Iniciar: `PENDENTE → EM_ANDAMENTO`.
- Concluir: `PENDENTE` ou `EM_ANDAMENTO → CONCLUIDA`.
- Editar título e descrição na listagem. **Não** altera status nem colaborador.
- Atividade concluída pode ter o texto editado e **permanece** concluída. Editar texto ≠ reabrir.

Não há tela de detalhe de atividade, pausa, cancelamento, reabertura ou histórico de status.

### Transições de status

```text
PENDENTE      → EM_ANDAMENTO   (PATCH /start)
PENDENTE      → CONCLUIDA      (PATCH /complete)
EM_ANDAMENTO  → CONCLUIDA      (PATCH /complete)
CONCLUIDA     → *              proibido
```

---

## Telas

| Rota | Tela |
| --- | --- |
| `/login` | Login |
| `/` | Dashboard |
| `/collaborators` | Lista de colaboradores + filtro por setor |
| `/collaborators/new` | Novo colaborador |
| `/collaborators/:id` | Detalhe / edição |
| `/activities` | Lista, filtros, iniciar, concluir, editar texto |
| `/activities/new` | Nova atividade |

Refresh em qualquer rota acima funciona: o Nginx devolve o `index.html` e o React Router resolve o caminho.

---

## API

Base no browser: `/api` (mesmo origin). Contrato de erro: `{ timestamp, status, message, fieldErrors? }`.

Listagens: `{ content, page, size, totalElements, totalPages }`.

| Método | Rota | Quem acessa | Resultado |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | público | `{ token }` |
| `POST` | `/api/collaborators` | autenticado | 201 |
| `GET` | `/api/collaborators` | autenticado | lista + `department` + `page`/`size` |
| `GET` | `/api/collaborators/{id}` | autenticado | detalhe |
| `PATCH` | `/api/collaborators/{id}` | autenticado | atualiza cadastro |
| `POST` | `/api/activities` | autenticado | 201, status `PENDENTE` |
| `GET` | `/api/activities` | autenticado | lista + filtros; item traz `{ id, fullName }` do colaborador |
| `PATCH` | `/api/activities/{id}/start` | autenticado | `EM_ANDAMENTO` |
| `PATCH` | `/api/activities/{id}/complete` | autenticado | `CONCLUIDA` |
| `PATCH` | `/api/activities/{id}` | autenticado | só `title` e/ou `description` |

Não existem: `GET/DELETE /api/activities/{id}`, `PUT` genérico, `PATCH .../status`, CRUD de usuário, `/health` como feature.

HTTP relevante: 400 validação, 401 não autenticado / credencial inválida, 404 id inexistente, 422 transição de status inválida.

---

## Stack

| Camada | Tecnologia |
| --- | --- |
| Backend | Java 21, Spring Boot 3.5, Maven, Spring Security, JWT (JJWT), Flyway, Bean Validation |
| Frontend | React 19, TypeScript, Vite, CSS Modules, React Router |
| Banco | PostgreSQL 16 |
| Entrega | Docker Compose: `db` + `backend` + `frontend` (Nginx) |

Monólito modular: `collaborator`, `activity`, `auth`, `shared`. UUID como identidade. Sem H2, Redis, Kafka ou Kubernetes.

---

## Estrutura

```text
revex-challenge/
  docker-compose.yml
  .env.example
  README.md
  docs/PLANNING.md
  backend/                  Spring Boot + Flyway
    Dockerfile
    src/main/java/com/revex/challenge/
      collaborator/
      activity/
      auth/
      shared/
  frontend/                 React + Vite
    Dockerfile
    nginx.conf              SPA + proxy /api
    src/app/
    src/features/
    src/shared/
```

---

## Testes (opcional)

Não são necessários para **rodar** o sistema. Úteis para validar o código.

Frontend (na pasta `frontend/`, com Node):

```bash
npm run lint
npx tsc --noEmit
npm run test
```

Backend: não há `mvnw` no repositório. Com o Compose no ar, os testes de integração usam o Postgres do serviço `db`:

```bash
docker run --rm --network revex-challenge_default \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/revex \
  -e SPRING_DATASOURCE_USERNAME=revex \
  -e SPRING_DATASOURCE_PASSWORD=revex \
  -v "$PWD/backend":/app -w /app \
  maven:3.9-eclipse-temurin-21 \
  mvn test
```

---

## Fora do escopo

Cadastro de usuário, recovery, papéis, inativação de colaborador, delete, reabrir atividade, `completed_at` / `updated_at`, histórico de status, Observabilidade, CI/CD e orquestração além do Compose.
