# Revex Challenge

Desafio técnico Full Stack para a Revex, desenvolvido com **Java/Spring Boot + React/TypeScript**.

## Stack

- Java 21
- Spring Boot
- Spring Security + JWT
- React + TypeScript + Vite
- PostgreSQL 16
- Flyway
- Docker / Docker Compose
- Nginx

## Como executar

### 1. Clonar o repositório

```bash
git clone https://github.com/matheusvoliveira/revex-challenge.git
cd revex-challenge
```

### 2. Subir a aplicação

O projeto pode ser executado completamente com Docker:

```bash
docker compose up --build
```

Após a inicialização, acesse:

```text
http://localhost:3000
```

Credenciais de demonstração:

```text
Usuário: revex
Senha: revex
```

A aplicação é composta por:

```text
Browser
   ↓
Nginx :3000
   ↓
Spring Boot :8080
   ↓
PostgreSQL :5432
```

As portas do backend e do banco ficam disponíveis apenas dentro da rede Docker.

Para parar:

```bash
docker compose down
```

Para remover também os dados do banco:

```bash
docker compose down -v
```

## Como testar

### Backend

Com Java 21 e Maven instalados:

```bash
cd backend
mvn test
```

Ou, utilizando Docker:

```bash
docker compose up -d db

docker run --rm --network host \
  -v "$PWD/backend":/app \
  -w /app \
  maven:3.9-eclipse-temurin-21 \
  mvn test
```

### Frontend

```bash
cd frontend
npm install
npm run lint
npx tsc --noEmit
npm test
```

## Funcionalidades

### Colaboradores

- Cadastro
- Listagem
- Filtro por departamento
- Visualização dos dados
- Validação dos campos

### Atividades

- Cadastro e associação a colaboradores
- Listagem e filtros
- Edição da descrição
- Início da atividade
- Conclusão da atividade

Fluxo de status:

```text
PENDENTE → EM_ANDAMENTO → CONCLUIDA
```

### Autenticação

A aplicação utiliza autenticação stateless com JWT.

## Arquitetura

O backend utiliza uma arquitetura de **monólito modular**, separando os principais domínios da aplicação:

```text
backend/
├── activity/
├── auth/
├── collaborator/
└── shared/
```

A escolha por um monólito modular foi intencional: o escopo do desafio não justifica a complexidade de uma arquitetura distribuída.

No frontend, a aplicação é organizada por funcionalidades e componentes compartilhados.

## Estrutura

```text
revex-challenge/
├── backend/          # API Spring Boot
├── frontend/         # Aplicação React
├── docs/             # Planejamento e documentação
├── docker-compose.yml
├── .env.example
└── README.md
```

## Escopo

O projeto prioriza a resolução do problema apresentado no desafio, mantendo a implementação pequena e coerente com o contexto.

Recursos como RBAC, recuperação de senha, microsserviços, filas e Kubernetes não fazem parte do escopo atual.
