package com.revex.challenge.auth.security;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;

import io.jsonwebtoken.ExpiredJwtException;
import java.time.Instant;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

class JwtServiceTest {

    private JwtService jwtService;

    @BeforeEach
    void setUp() {
        JwtProperties properties = new JwtProperties();
        properties.setSecret("local-dev-only-secret-min-32-bytes-ok");
        properties.setExpirationSeconds(28800);
        jwtService = new JwtService(properties);
    }

    @Test
    void createToken_containsSubject() {
        String token = jwtService.createToken("revex");

        assertThat(jwtService.requireUsername(token)).isEqualTo("revex");
    }

    @Test
    void requireUsername_rejectsExpiredToken() {
        String token = jwtService.createToken("revex", Instant.now().minusSeconds(5));

        assertThatThrownBy(() -> jwtService.requireUsername(token))
                .isInstanceOf(ExpiredJwtException.class);
    }
}
