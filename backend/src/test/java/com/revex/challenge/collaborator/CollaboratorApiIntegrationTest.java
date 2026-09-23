package com.revex.challenge.collaborator;

import static org.hamcrest.Matchers.hasSize;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.patch;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

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

/**
 * Integração contra o Postgres do docker compose (localhost:5432).
 * Testcontainers ficou de fora neste ambiente: o Docker Engine 29 recusa
 * o client API 1.32 embarcado na lib. Fallback previsto no planning.
 */
@SpringBootTest
@AutoConfigureMockMvc
@Transactional
@WithMockUser(username = "revex")
class CollaboratorApiIntegrationTest {

    @Autowired
    private MockMvc mockMvc;

    @Autowired
    private ObjectMapper objectMapper;

    @Test
    void create_returns201AndPersistedFields() throws Exception {
        mockMvc.perform(post("/api/collaborators")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validBody("Maria Souza", "RH"))))
                .andExpect(status().isCreated())
                .andExpect(jsonPath("$.id").isNotEmpty())
                .andExpect(jsonPath("$.fullName").value("Maria Souza"))
                .andExpect(jsonPath("$.jobTitle").value("Analista"))
                .andExpect(jsonPath("$.department").value("RH"))
                .andExpect(jsonPath("$.admissionDate").value("2024-03-01"))
                .andExpect(jsonPath("$.salary").value(4200.00));
    }

    @Test
    void create_rejectsNonPositiveSalaryWithFieldError() throws Exception {
        Map<String, Object> body = new HashMap<>(validBody("João Lima", "TI"));
        body.put("salary", 0);

        mockMvc.perform(post("/api/collaborators")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(body)))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.status").value(400))
                .andExpect(jsonPath("$.fieldErrors[0].field").value("salary"));
    }

    @Test
    void getById_returns404WhenMissing() throws Exception {
        mockMvc.perform(get("/api/collaborators/{id}", UUID.randomUUID()))
                .andExpect(status().isNotFound())
                .andExpect(jsonPath("$.status").value(404))
                .andExpect(jsonPath("$.message").value("Colaborador não encontrado."));
    }

    @Test
    void list_filtersDepartmentCaseInsensitive() throws Exception {
        mockMvc.perform(post("/api/collaborators")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validBody("Carlos TI", "TI"))))
                .andExpect(status().isCreated());
        mockMvc.perform(post("/api/collaborators")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validBody("Paula RH", "RH"))))
                .andExpect(status().isCreated());

        mockMvc.perform(get("/api/collaborators").param("department", "ti"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.content[?(@.fullName == 'Carlos TI')]", hasSize(1)))
                .andExpect(jsonPath("$.content[?(@.fullName == 'Paula RH')]", hasSize(0)))
                .andExpect(jsonPath("$.totalElements").isNumber());
    }

    @Test
    void update_changesPersistedFields() throws Exception {
        MvcResult created = mockMvc.perform(post("/api/collaborators")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(validBody("Ana Silva", "TI"))))
                .andExpect(status().isCreated())
                .andReturn();
        String id = objectMapper.readTree(created.getResponse().getContentAsString()).get("id").asText();

        Map<String, Object> update = new HashMap<>(validBody("Ana Costa", "RH"));
        update.put("jobTitle", "Dev");
        mockMvc.perform(patch("/api/collaborators/{id}", id)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(update)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.fullName").value("Ana Costa"))
                .andExpect(jsonPath("$.jobTitle").value("Dev"))
                .andExpect(jsonPath("$.department").value("RH"));
    }

    private Map<String, Object> validBody(String fullName, String department) {
        return Map.of(
                "fullName", fullName,
                "jobTitle", "Analista",
                "department", department,
                "admissionDate", LocalDate.of(2024, 3, 1).toString(),
                "salary", new BigDecimal("4200.00")
        );
    }
}
