# Revex Challenge

Desafio técnico Full Stack para a Revex, desenvolvido com **Java/Spring Boot + React/TypeScript**.

## Stack

- Java 21
- Spring Boot 3.5
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

A aplicação pode ser executada completamente com Docker, sem necessidade de instalar Java, Maven ou Node.js no ambiente local.

```bash
docker compose up --build
```

Após os serviços iniciarem, acesse:

```text
http://localhost:3000
```

Para verificar o status dos containers:

```bash
docker compose ps
```

Credenciais de demonstração:

```text
Usuário: revex
Senha: revex
```

### Arquitetura de execução

```text
Browser
   ↓
Nginx
   ↓
Spring Boot
   ↓
PostgreSQL
```

A aplicação publica somente a porta `3000` no host. O backend e o banco permanecem na rede interna do Docker.

Para parar a aplicação:

```bash
docker compose down
```

Para remover também os dados persistidos:

```bash
docker compose down -v
```

## Como testar

### Backend

Os testes do backend incluem testes unitários e de integração.

Com Docker:

```bash
docker compose up -d db

docker run --rm \
  --network revex-challenge_default \
  -e SPRING_DATASOURCE_URL=jdbc:postgresql://db:5432/revex \
  -e SPRING_DATASOURCE_USERNAME=revex \
  -e SPRING_DATASOURCE_PASSWORD=revex \
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

### Autenticação

- Login com JWT.
- Autenticação stateless.
- Proteção das rotas da API.
- Sessão mantida no `sessionStorage`.

### Dashboard

- Resumo de colaboradores e atividades.
- Indicadores por status.
- Lista de atividades recentes.

### Colaboradores

- Cadastro de colaboradores.
- Listagem e filtro por setor.
- Visualização dos dados.
- Edição do cadastro.
- Validação dos campos.

### Atividades

- Cadastro e associação a colaboradores.
- Listagem e filtros por colaborador e status.
- Edição de título e descrição.
- Início e conclusão de atividades.

Fluxo de status:

```text
PENDENTE → EM_ANDAMENTO → CONCLUIDA
     └──────────────────→ CONCLUIDA
```

Atividades concluídas podem ter seus dados textuais editados sem alterar seu status.

## Arquitetura

O backend utiliza um **monólito modular**, organizado por domínio:

```text
backend/src/main/java/com/revex/challenge/
├── activity/
├── auth/
├── collaborator/
└── shared/
```

A escolha busca manter os limites entre os domínios sem adicionar complexidade distribuída desnecessária para o contexto do desafio.

O frontend segue uma organização por funcionalidades:

```text
frontend/src/
├── features/
│   ├── auth/
│   ├── collaborators/
│   ├── activities/
│   └── dashboard/
└── shared/
```

## Estrutura

```text
revex-challenge/
├── backend/            # API Spring Boot
├── frontend/           # Aplicação React
├── docs/               # Planejamento
├── docker-compose.yml  # Ambiente completo
├── .env.example        # Variáveis de ambiente
└── README.md
```

## Escopo

O projeto foi desenvolvido buscando manter uma implementação objetiva e coerente com o problema apresentado no desafio.

Funcionalidades adicionais como RBAC, recuperação de senha, cadastro de usuários, microsserviços, filas e Kubernetes não fazem parte do escopo atual.
