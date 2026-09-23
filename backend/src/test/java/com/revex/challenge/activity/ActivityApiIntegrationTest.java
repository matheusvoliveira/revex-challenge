package com.revex.challenge.activity;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.HashMap;
import java.util.Map;
import java.util.UUID;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.http.MediaType;
import org.springframework.security.test.context.support.WithMockUser;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.MvcResult;
import org.springframework.transaction.annotation.Transactional;

@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser(username = "revex")
class ActivityApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void create_returns201AssociatedToCollaborator() throws Exception {
        UUID collaboratorId = createCollaborator("Maria Souza");

        mockMvc.perform(post("/api/activities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(activityBody("Revisar contrato", collaboratorId))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.title").value("Revisar contrato"))
                .andExpect(jsonPath("$.description").value("Revisar contrato"))
                .andExpect(jsonPath("$.status").value("PENDENTE"))
                .andExpect(jsonPath("$.collaborator.id").value(collaboratorId.toString()))
                .andExpect(jsonPath("$.collaborator.fullName").value("Maria Souza"));
    }

    @Test
    void create_returns404WhenCollaboratorMissing() throws Exception {
        mockMvc.perform(post("/api/activities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(
                                activityBody("Revisar contrato", UUID.randomUUID()))))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Colaborador não encontrado."));
    }

    @Test
    void create_rejectsBlankDescription() throws Exception {
        UUID collaboratorId = createCollaborator("João Lima");

        mockMvc.perform(post("/api/activities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(activityBody("   ", collaboratorId))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[0].field").value("description"));
    }

    @Test
    void list_filtersByCollaboratorAndStatus() throws Exception {
        UUID first = createCollaborator("Carlos TI");
        UUID second = createCollaborator("Paula RH");
        UUID pending = createActivity("Atividade pendente", first);
        createActivity("Outra pessoa", second);
        mockMvc.perform(patch("/api/activities/{id}/complete", pending))
                .andExpect(status().isOk());

        mockMvc.perform(get("/api/activities").param("collaboratorId", first.toString()))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[?(@.description == 'Atividade pendente')]", hasSize(1)))
                .andExpect(jsonPath("$.content[?(@.description == 'Outra pessoa')]", hasSize(0)));

        mockMvc.perform(get("/api/activities").param("status", "CONCLUIDA"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[?(@.description == 'Atividade pendente')]", hasSize(1)))
                .andExpect(jsonPath("$.content[?(@.description == 'Outra pessoa')]", hasSize(0)));
    }

    @Test
    void start_movesPendingToInProgress() throws Exception {
        UUID collaboratorId = createCollaborator("Ana Start");
        UUID activityId = createActivity("Iniciar relatório", collaboratorId);

        mockMvc.perform(patch("/api/activities/{id}/start", activityId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("EM_ANDAMENTO"));
    }

    @Test
    void start_rejectsWhenNotPending() throws Exception {
        UUID collaboratorId = createCollaborator("Ana Start 2");
        UUID activityId = createActivity("Já iniciada", collaboratorId);
        mockMvc.perform(patch("/api/activities/{id}/start", activityId))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/activities/{id}/start", activityId))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.status").value(422))
                .andExpect(jsonPath("$.message").value("Só é possível iniciar uma atividade pendente."));
    }

    @Test
    void complete_fromPendingAndBlocksSecondConclusion() throws Exception {
        UUID collaboratorId = createCollaborator("Ana Complete");
        UUID activityId = createActivity("Fechar sprint", collaboratorId);

        mockMvc.perform(patch("/api/activities/{id}/complete", activityId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONCLUIDA"));

        mockMvc.perform(patch("/api/activities/{id}/complete", activityId))
                .andExpect(status().isUnprocessableEntity())
                .andExpect(jsonPath("$.status").value(422))
                .andExpect(jsonPath("$.message").value("Não é possível concluir uma atividade já concluída."));
    }

    @Test
    void complete_fromInProgress() throws Exception {
        UUID collaboratorId = createCollaborator("Ana Flow");
        UUID activityId = createActivity("Fluxo completo", collaboratorId);
        mockMvc.perform(patch("/api/activities/{id}/start", activityId))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/activities/{id}/complete", activityId))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.status").value("CONCLUIDA"));
    }

    @Test
    void lifecycle_returns404WhenActivityMissing() throws Exception {
        UUID missing = UUID.randomUUID();

        mockMvc.perform(patch("/api/activities/{id}/start", missing))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Atividade não encontrada."));

        mockMvc.perform(patch("/api/activities/{id}/complete", missing))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Atividade não encontrada."));
    }

    @Test
    void updateDescription_changesTextAndKeepsStatusAndCollaborator() throws Exception {
        UUID collaboratorId = createCollaborator("Ana Edit");
        UUID activityId = createActivity("Texto antigo", collaboratorId);

        mockMvc.perform(patch("/api/activities/{id}", activityId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("description", "Texto novo"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Texto novo"))
                .andExpect(jsonPath("$.status").value("PENDENTE"))
                .andExpect(jsonPath("$.collaborator.id").value(collaboratorId.toString()));
    }

    @Test
    void updateDescription_onCompletedKeepsCompleted() throws Exception {
        UUID collaboratorId = createCollaborator("Ana Done Edit");
        UUID activityId = createActivity("Fechada", collaboratorId);
        mockMvc.perform(patch("/api/activities/{id}/complete", activityId))
                .andExpect(status().isOk());

        mockMvc.perform(patch("/api/activities/{id}", activityId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("description", "Ainda fechada"))))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.description").value("Ainda fechada"))
                .andExpect(jsonPath("$.status").value("CONCLUIDA"))
                .andExpect(jsonPath("$.collaborator.id").value(collaboratorId.toString()));
    }

    @Test
    void updateDescription_rejectsBlankAndForbiddenFields() throws Exception {
        UUID collaboratorId = createCollaborator("Ana Guard");
        UUID activityId = createActivity("Original", collaboratorId);

        mockMvc.perform(patch("/api/activities/{id}", activityId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("description", "   "))))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors[0].field").value("description"));

        Map<String, Object> withStatus = new HashMap<>();
        withStatus.put("description", "Tentativa");
        withStatus.put("status", "CONCLUIDA");
        mockMvc.perform(patch("/api/activities/{id}", activityId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(withStatus)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Só é permitido alterar título e descrição."));

        Map<String, Object> withCollaborator = new HashMap<>();
        withCollaborator.put("description", "Tentativa");
        withCollaborator.put("collaboratorId", UUID.randomUUID().toString());
        mockMvc.perform(patch("/api/activities/{id}", activityId)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(withCollaborator)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.message").value("Só é permitido alterar título e descrição."));
    }

    @Test
    void updateDescription_returns404WhenMissing() throws Exception {
        mockMvc.perform(patch("/api/activities/{id}", UUID.randomUUID())
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of("description", "Nada"))))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.message").value("Atividade não encontrada."));
    }

    private UUID createCollaborator(String fullName) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/collaborators")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(Map.of(
                                "fullName", fullName,
                                "jobTitle", "Analista",
                                "department", "TI",
                                "admissionDate", LocalDate.of(2024, 3, 1).toString(),
                                "salary", new BigDecimal("4200.00")
                        ))))
                .andExpect(status().isCreated())
                .andReturn();
        JsonNode body = objectMapper.readTree(result.getResponse().getContentAsString());
        return UUID.fromString(body.get("id").asText());
    }

    private UUID createActivity(String description, UUID collaboratorId) throws Exception {
        MvcResult result = mockMvc.perform(post("/api/activities")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(activityBody(description, collaboratorId))))
                .andExpect(status().isCreated())
                .andReturn();
        JsonNode body = objectMapper.readTree(result.getResponse().getContentAsString());
        return UUID.fromString(body.get("id").asText());
    }

    private Map<String, Object> activityBody(String description, UUID collaboratorId) {
        String title = description.trim().isEmpty()
                ? "Título"
                : description.substring(0, Math.min(description.length(), 100));
        Map<String, Object> body = new HashMap<>();
        body.put("title", title);
        body.put("description", description);
        body.put("collaboratorId", collaboratorId.toString());
        return body;
    }
}
