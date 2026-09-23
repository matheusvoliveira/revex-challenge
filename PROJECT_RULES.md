# PROJECT RULES

## 1. Objetivo

Este documento define as regras técnicas, arquiteturais e de desenvolvimento do projeto do desafio técnico da Revex.

O objetivo não é construir um sistema maior do que o solicitado, mas demonstrar capacidade de:

- entender o problema antes de implementar;
- transformar requisitos em uma solução coerente;
- construir software organizado e sustentável;
- aplicar boas práticas de Java, Spring Boot, React e TypeScript;
- manter baixo acoplamento e responsabilidades claras;
- testar comportamentos relevantes;
- documentar decisões importantes;
- trabalhar com Git de forma profissional;
- entregar uma aplicação que outro desenvolvedor consiga entender e manter.

A prioridade é **simplicidade deliberada**.

> Nenhuma complexidade deve entrar no sistema sem uma necessidade identificável.

---

# 2. Princípios fundamentais

## 2.1 Entender antes de implementar

Antes de implementar uma funcionalidade:

1. entender o requisito;
2. identificar o problema que está sendo resolvido;
3. identificar regras de negócio;
4. avaliar impacto na arquitetura;
5. definir a menor solução coerente;
6. implementar;
7. testar;
8. revisar.

Não implementar funcionalidades apenas porque parecem interessantes ou porque poderiam existir em uma aplicação real.

---

## 2.2 Respeitar o escopo

O requisito do desafio é a fonte principal de verdade.

Extensões são permitidas quando forem:

- naturais ao domínio;
- pequenas em complexidade;
- de baixo risco;
- coerentes com o produto;
- úteis para demonstrar qualidade técnica.

Não implementar funcionalidades que alterem o problema original ou transformem o desafio em outro produto.

Exemplos de funcionalidades que não devem ser introduzidas sem requisito explícito:

- microserviços;
- Kafka;
- Redis;
- Kubernetes;
- CQRS;
- Event Sourcing;
- GraphQL;
- Elasticsearch;
- algoritmos de otimização de escala;
- previsão de demanda;
- sistemas de notificações complexos;
- arquitetura distribuída sem necessidade.

---

# 3. Arquitetura

## 3.1 Estilo arquitetural

O backend deve utilizar um **Modular Monolith**.

Os módulos principais são:

- Auth;
- Collaborator;
- Activity;
- Shared, apenas para responsabilidades realmente compartilhadas.

O projeto não deve utilizar microserviços.

A arquitetura deve permitir evolução futura sem introduzir complexidade desnecessária no MVP.

---

## 3.2 Organização por domínio

A organização deve priorizar módulos/funcionalidades.

Exemplo:

```text
collaborator/
├── controller/
├── dto/
├── entity/
├── repository/
└── service/
```

Evitar uma arquitetura global baseada apenas em camadas:

```text
controller/
service/
repository/
entity/
```

quando isso fizer com que uma mesma funcionalidade fique espalhada pelo projeto inteiro.

A regra é:

> Se eu quiser entender uma funcionalidade, devo conseguir encontrar suas principais responsabilidades em um local previsível.

---

## 3.3 Responsabilidades

### Controllers

- recebem requisições;
- validam entrada através dos mecanismos apropriados;
- delegam operações;
- retornam respostas HTTP.

Controllers não devem conter regras de negócio relevantes.

### Services

- coordenam casos de uso;
- aplicam regras de negócio;
- controlam transações quando necessário.

### Repositories

- lidam com persistência;
- não devem conter regras de negócio que pertençam ao domínio/aplicação.

### Entities

- representam o modelo persistido;
- não devem ser utilizadas automaticamente como contrato público da API.

### DTOs

- representam contratos de entrada e saída da API;
- devem impedir que detalhes internos sejam expostos desnecessariamente.

---

# 4. Dependências entre módulos

Módulos não devem acessar diretamente detalhes internos de outros módulos.

Evitar:

```text
Activity → CollaboratorRepository
```

apenas para manipular diretamente a persistência do módulo Collaborator.

Preferir comunicação através de contratos e serviços apropriados.

Nenhum módulo deve conhecer detalhes desnecessários da implementação de outro.

---

# 5. Clean Code

Clean Code é um princípio, não uma coleção de regras mecânicas.

O objetivo é produzir código:

- legível;
- previsível;
- testável;
- coeso;
- simples de modificar.

## 5.1 Nomes

Utilizar nomes claros e específicos.

Evitar:

```text
data
info
obj
temp
process()
handle()
doSomething()
```

quando houver uma descrição mais precisa.

Preferir nomes que expressem intenção.

---

## 5.2 Funções

Funções devem possuir responsabilidades claras.

Evitar funções excessivamente grandes ou que realizem várias responsabilidades independentes.

Também evitar dividir código excessivamente apenas para atingir um determinado tamanho de função.

Não criar abstrações sem benefício concreto.

---

## 5.3 Classes

Classes devem possuir responsabilidades coerentes.

Evitar classes que concentrem responsabilidades de múltiplos domínios.

Evitar também criar classes artificiais apenas para seguir uma regra de estilo.

---

## 5.4 Código explícito

Preferir código fácil de entender em vez de código excessivamente inteligente, abstrato ou conciso.

> Se uma solução é tecnicamente sofisticada, mas exige esforço desnecessário para ser compreendida, provavelmente existe uma solução mais simples.

---

# 6. Comentários

Os comentários do código devem ser escritos em **português**.

O idioma dos comentários existe para facilitar a manutenção e, principalmente, permitir que o desenvolvedor responsável consiga compreender e explicar o sistema durante uma revisão técnica ou entrevista.

Comentários devem explicar principalmente:

- decisões de negócio;
- motivos de decisões técnicas;
- comportamentos não óbvios;
- limitações intencionais;
- decisões que poderiam parecer estranhas sem contexto.

Evitar comentários que apenas repitam o código.

### Ruim

```java
// Define active como false
collaborator.setActive(false);
```

### Bom

```java
// A exclusão é tratada como inativação para preservar o histórico
// de atividades associado ao colaborador.
collaborator.setActive(false);
```

Comentários não devem substituir código mal escrito.

---

# 7. Documentação

A documentação deve explicar:

- o problema;
- o domínio;
- a arquitetura;
- decisões importantes;
- como executar o projeto;
- como testar;
- como contribuir/manter.

Documentação não deve existir apenas para aumentar a quantidade de arquivos.

Documentar decisões relevantes através de ADRs quando necessário.

---

# 8. Banco de dados

O banco principal será PostgreSQL.

Alterações de schema devem ser versionadas através de migrations.

Não modificar manualmente o banco de desenvolvimento de maneira que gere divergência entre ambientes.

O banco deve preservar informações históricas importantes.

Colaboradores não devem ser fisicamente removidos quando isso causar perda de contexto das atividades associadas.

A inativação deve ser utilizada quando aplicável.

---

# 9. Regras de negócio

Regras de negócio devem ser implementadas no backend e não depender exclusivamente da interface.

Exemplo:

Uma atividade concluída não pode ser reaberta no MVP.

Essa regra deve ser protegida pelo backend mesmo que a interface não ofereça um botão para reabrir.

O frontend deve facilitar a experiência, mas não ser responsável pela integridade do domínio.

---

# 10. Backend — Java / Spring Boot

Seguir as convenções e boas práticas do ecossistema Java/Spring.

Priorizar:

- dependency injection;
- constructor injection;
- Bean Validation;
- DTOs;
- tratamento global de exceções;
- transações apenas quando necessárias;
- migrations;
- serviços com responsabilidades claras;
- repositories focados em persistência;
- testes automatizados.

Evitar:

- field injection;
- lógica de negócio em controllers;
- try/catch espalhado;
- exposição direta de entidades;
- abstrações prematuras;
- métodos genéricos sem responsabilidade clara;
- dependências desnecessárias.

Erros esperados devem ser tratados de maneira previsível.

Erros inesperados não devem ser silenciosamente ignorados.

---

# 11. Frontend — React / TypeScript

Seguir boas práticas modernas do ecossistema React e TypeScript.

Priorizar:

- TypeScript strict;
- componentes com responsabilidades claras;
- hooks apropriados;
- estado no nível mais baixo possível;
- separação entre UI e acesso à API;
- estados de loading, erro e vazio;
- validação adequada de formulários;
- acessibilidade básica;
- reutilização quando houver necessidade real.

Evitar:

- `useEffect` desnecessário;
- estado global sem necessidade;
- lógica de negócio complexa dentro do JSX;
- componentes gigantes;
- prop drilling excessivo;
- componentes genéricos criados antes de existir reutilização;
- bibliotecas adicionadas apenas por preferência.

---

# 12. Testes

Testes devem validar comportamento e risco, não quantidade de linhas.

A estratégia seguirá uma pirâmide:

```text
        Smoke
       /     \
  Integration
     /       \
       Unit
```

## Unit

Utilizados principalmente para:

- regras de negócio;
- transições de estado;
- validações relevantes;
- comportamentos com múltiplos cenários.

## Integration

Utilizados quando for importante validar a integração entre componentes reais, especialmente:

- API;
- banco;
- repositories;
- migrations;
- fluxo entre camadas.

## Smoke

Devem cobrir os fluxos críticos da aplicação.

Exemplo:

```text
Login
  ↓
Criar colaborador
  ↓
Listar colaborador
  ↓
Criar atividade
  ↓
Concluir atividade
```

Não testar cada getter, setter ou linha trivial apenas para aumentar cobertura.

---

# 13. Definition of Done

Uma tarefa somente pode ser considerada concluída quando:

- requisito implementado;
- regras de negócio atendidas;
- testes relevantes implementados;
- testes existentes continuam passando;
- aplicação compila;
- lint/typecheck passam quando aplicável;
- nenhuma alteração desnecessária foi introduzida;
- arquitetura continua coerente;
- documentação atualizada quando necessário;
- diff revisado.

---

# 14. Sprint Go / No-Go

Toda Sprint possui um gate obrigatório antes da próxima Sprint.

## Functional Gate

Verificar:

- requisitos;
- regras de negócio;
- fluxos principais;
- validações.

## Quality Gate

Verificar:

- testes;
- build;
- lint;
- typecheck;
- integração;
- smoke tests quando aplicável.

## Architecture Gate

Verificar:

- responsabilidades;
- dependências;
- acoplamento;
- organização das pastas;
- ausência de abstrações desnecessárias;
- ausência de violações arquiteturais.

## Project Gate

Verificar:

- documentação;
- Git;
- diff;
- escopo;
- legibilidade;
- manutenção futura.

### GO

A Sprint pode ser encerrada e a próxima iniciada.

### NO-GO

A próxima Sprint não começa até que os problemas relevantes sejam corrigidos ou uma decisão explícita seja tomada.

---

# 15. Git

O projeto utilizará Git desde o início.

Os commits devem representar unidades lógicas de mudança.

Não agrupar diversas funcionalidades independentes em um único commit.

O histórico deve permitir compreender a evolução do projeto.

---

# 16. Conventional Commits

As mensagens de commit devem ser escritas em **inglês**.

Tipos permitidos:

```text
feat
fix
docs
style
refactor
test
chore
```

### Exemplos

```text
chore: initialize project structure
docs: define project architecture
feat: create collaborator
test: add collaborator creation tests
fix: prevent completed activities from being reopened
refactor: simplify collaborator validation
```

A mensagem deve ser curta, específica e descrever a mudança realizada.

Não realizar commits automaticamente sem revisão da mensagem.

Quando uma unidade lógica estiver pronta, sugerir uma mensagem de commit e solicitar confirmação antes de criar o commit.

---

# 17. Uso de IA

A IA é uma ferramenta de desenvolvimento, não substituta do entendimento técnico.

Antes de implementar mudanças relevantes, a IA deve:

1. analisar o contexto existente;
2. identificar arquivos afetados;
3. explicar a abordagem;
4. identificar riscos;
5. propor a menor solução coerente;
6. aguardar aprovação quando houver decisão arquitetural relevante.

A IA não deve:

- implementar todo o projeto de uma vez;
- criar funcionalidades fora do escopo;
- alterar regras de negócio sem aprovação;
- introduzir novas tecnologias sem justificativa;
- realizar grandes refatorações não solicitadas;
- criar abstrações para problemas hipotéticos.

Após implementação:

- executar testes apropriados;
- verificar o diff;
- verificar impacto arquitetural;
- identificar mudanças não relacionadas;
- sugerir commit.

---

# 18. Entendimento do desenvolvedor

Nenhuma funcionalidade deve ser considerada concluída apenas porque a IA conseguiu implementá-la.

O desenvolvedor responsável deve conseguir:

- explicar o código;
- explicar as decisões arquiteturais;
- explicar as regras de negócio;
- explicar os testes;
- justificar as principais dependências;
- modificar a implementação manualmente quando necessário.

> O objetivo não é produzir código que a IA entende. O objetivo é produzir código que o desenvolvedor entende e consegue manter.

---

# 19. Controle de complexidade

Toda nova abstração, biblioteca ou componente arquitetural deve responder:

1. Qual problema real isso resolve?
2. Por que a solução atual não é suficiente?
3. Qual é o custo adicional?
4. Isso aumenta ou reduz o acoplamento?
5. Isso facilita manutenção ou apenas adiciona estrutura?
6. Essa decisão é necessária agora?

Se não houver uma justificativa clara, preferir a solução mais simples.

---

# 20. Regra de manutenção

Antes de alterar código existente:

1. entender o comportamento atual;
2. identificar dependências;
3. verificar testes existentes;
4. avaliar impacto;
5. alterar somente o necessário;
6. executar os testes afetados;
7. revisar o diff.

Não realizar refatorações não relacionadas durante a implementação de uma feature.

---

# 21. Princípio final

> **Código limpo é código fácil de entender e modificar.**
>
> **Projeto limpo é projeto fácil de navegar, testar, explicar e manter.**
>
> **Arquitetura boa é a arquitetura suficiente para resolver o problema atual sem impedir sua evolução.**
>
> **Simplicidade deliberada: nenhuma complexidade entra no sistema sem uma necessidade identificável.**

---

# 22. Tratamento e validação de dados

Os dados devem ser tratados de acordo com sua natureza desde a entrada até a persistência.

Frontend e backend devem possuir validações apropriadas.

## 22.1 Input Mask

Utilizar input masks quando elas melhorarem a experiência de entrada de dados, especialmente para campos com formato previsível.

A máscara deve:

- facilitar a entrada;
- impedir formatos obviamente inválidos quando possível;
- não substituir validação;
- não alterar silenciosamente o significado do dado;
- manter compatibilidade com o formato esperado pela API.

Exemplo:

Um campo de salário pode apresentar formatação monetária na interface, mas a API deve receber um valor numérico apropriado, e não a string formatada.

---

## 22.2 Validação no Frontend

O frontend deve validar os dados antes do envio quando isso melhorar a experiência do usuário.

Devem ser considerados, quando aplicável:

- campos obrigatórios;
- tamanho mínimo e máximo;
- formato;
- tipo;
- valores permitidos;
- valores mínimos e máximos;
- padrões específicos do domínio.

A validação deve fornecer feedback próximo ao campo quando o erro puder ser corrigido pelo usuário.

---

## 22.3 Validação no Backend

O backend deve validar novamente todos os dados recebidos pela API.

Nunca confiar exclusivamente na validação do frontend.

As regras de integridade devem ser protegidas no backend mesmo quando a interface já realiza a mesma validação.

Exemplos:

- salário deve ser positivo;
- nome deve respeitar tamanho máximo;
- email deve possuir formato válido quando aplicável;
- datas devem possuir formato válido;
- enumerações devem aceitar somente valores previstos;
- IDs devem possuir formato válido;
- campos obrigatórios não podem ser nulos;
- strings não devem exceder os limites definidos pelo domínio.

---

## 22.4 Tipos e persistência

O tipo utilizado deve refletir a natureza do dado.

Não utilizar `String` para representar dados que possuem semântica numérica, temporal ou enumerada apenas por conveniência.

A definição deve ser coerente entre:

```text
Interface
    ↓
DTO
    ↓
Domínio
    ↓
Banco de dados
```

Os limites definidos no banco devem ser compatíveis com as regras da aplicação.

---

## 22.5 Limites

Sempre que um campo possuir limite razoável de tamanho, quantidade ou valor, esse limite deve ser explicitamente definido.

Evitar limites arbitrários sem justificativa.

O objetivo é proteger:

- integridade dos dados;
- banco de dados;
- API;
- experiência do usuário;
- previsibilidade do sistema.

---

## 22.6 Tratamento de erros para o usuário

Erros esperados e corrigíveis pelo usuário devem produzir feedback claro.

Exemplos:

- dados inválidos;
- campo obrigatório;
- colaborador não encontrado;
- atividade inexistente;
- transição de status inválida;
- credenciais inválidas.

Quando fizer sentido, o frontend deve apresentar o erro em uma mensagem visual clara, como:

- alert;
- toast;
- modal;
- mensagem contextual no formulário.

A escolha deve considerar o contexto do erro.

Não exibir stack traces, detalhes internos ou mensagens técnicas para o usuário final.

---

## 22.7 Erros inesperados

Erros inesperados devem ser tratados de maneira segura.

O usuário deve receber uma mensagem compreensível, enquanto detalhes técnicos devem permanecer nos logs apropriados.

Exemplo:

Mensagem para o usuário:

> "Não foi possível concluir a atividade. Tente novamente."

Log interno:

```text
detalhes técnicos do erro
```

Nunca expor informações sensíveis ou detalhes internos da aplicação na resposta da API.

---

# 23. Regra de consistência de dados

Todo campo deve possuir uma definição coerente de ponta a ponta.

Antes de implementar um novo campo, definir:

1. significado no domínio;
2. tipo no frontend;
3. formato de entrada;
4. máscara, quando aplicável;
5. validações;
6. tipo no DTO;
7. tipo no domínio;
8. tipo no banco;
9. limites;
10. formato de saída da API.

Evitar conversões desnecessárias entre camadas.

Quando uma conversão for necessária, ela deve acontecer em um ponto claramente definido.

---

# 24. Feedback visual

A aplicação deve fornecer feedback adequado para as principais situações de interação.

Considerar estados:

- carregando;
- sucesso;
- erro;
- vazio;
- validação;
- ação indisponível;
- operação em andamento.

A interface não deve deixar o usuário sem indicação sobre o resultado de uma ação.

Exemplos:

```text
Salvar colaborador
       ↓
    loading
       ↓
 ┌─────┴─────┐
 ↓           ↓
Sucesso      Erro
 ↓           ↓
feedback     mensagem
```

Mensagens devem ser claras, curtas e orientadas à ação quando apropriado.

Evitar mensagens técnicas como:

```text
"HTTP 400"
"NullPointerException"
"ConstraintViolationException"
```

na interface do usuário.

---

# 25. Regra para novas dependências

Nenhuma biblioteca ou dependência deve ser adicionada apenas porque é popular ou conveniente.

Antes de adicionar uma dependência relevante, avaliar:

1. qual problema ela resolve;
2. se o problema pode ser resolvido adequadamente com recursos já disponíveis;
3. impacto no tamanho e complexidade do projeto;
4. manutenção;
5. compatibilidade com o stack;
6. necessidade real dentro do escopo.

A dependência deve ser adicionada somente quando seu benefício justificar seu custo.

---

# 26. Regra para alterações arquiteturais

Alterações que modificam significativamente a arquitetura devem ser discutidas antes da implementação.

Exemplos:

- criação de novo módulo;
- mudança de responsabilidade entre módulos;
- introdução de nova infraestrutura;
- nova biblioteca estrutural;
- mudança no padrão de persistência;
- alteração significativa no fluxo de autenticação;
- mudança no contrato principal da API.

Quando a decisão for relevante, registrar através de ADR.

A decisão deve conter:

- contexto;
- problema;
- opções consideradas;
- decisão;
- consequências.

---

# 27. Regra de revisão

Antes de considerar uma tarefa concluída, realizar uma revisão considerando:

### Funcionalidade

- O requisito foi atendido?
- As regras de negócio estão corretas?

### Código

- O código é legível?
- As responsabilidades estão claras?
- Existem abstrações desnecessárias?
- Existem duplicações relevantes?

### Arquitetura

- Os módulos continuam isolados?
- O acoplamento está controlado?
- Alguma camada passou a conhecer detalhes que não deveria?

### Dados

- Os tipos estão corretos?
- Os limites estão definidos?
- Frontend, backend e banco estão coerentes?
- As validações estão presentes nas camadas necessárias?

### UX

- Loading está tratado?
- Erros estão tratados?
- Estados vazios estão tratados?
- O usuário recebe feedback das ações?

### Testes

- Os comportamentos relevantes estão cobertos?
- Os testes existentes continuam passando?

### Git

- O diff contém somente mudanças relacionadas?
- A mudança representa uma unidade lógica?
- Existe uma mensagem de commit adequada?

---

# 28. Regra de evolução

O projeto deve evoluir incrementalmente.

Cada mudança deve preservar o que já funciona.

Preferir:

```text
pequena mudança
      ↓
teste
      ↓
review
      ↓
commit
      ↓
próxima mudança
```

em vez de:

```text
grande implementação
      ↓
muitos arquivos alterados
      ↓
testar tudo no final
```

---

# 29. Princípios finais de desenvolvimento

Este projeto deve seguir os seguintes princípios:

1. **Entender o problema antes de melhorar o problema.**
2. **Simplicidade deliberada.**
3. **Código deve ser fácil de entender e modificar.**
4. **Projeto deve ser fácil de navegar e manter.**
5. **Regras de negócio pertencem ao backend.**
6. **Frontend melhora a experiência, mas não garante integridade.**
7. **Dados devem ser tratados de acordo com sua natureza.**
8. **Validação deve existir em todas as camadas necessárias.**
9. **Input mask melhora UX, mas nunca substitui validação.**
10. **Erros devem produzir feedback apropriado ao usuário.**
11. **Complexidade deve possuir uma justificativa.**
12. **A IA não deve substituir o entendimento do desenvolvedor.**
13. **Nenhuma Sprint avança sem passar pelo Go/No-Go.**
14. **Commits devem representar mudanças lógicas.**
15. **Decisões arquiteturais relevantes devem ser explícitas.**
16. **Não implementar funcionalidades apenas porque parecem interessantes.**
17. **Não refatorar código não relacionado sem uma razão concreta.**
18. **O sistema deve ser simples o suficiente para ser explicado pelo desenvolvedor durante uma entrevista técnica.**