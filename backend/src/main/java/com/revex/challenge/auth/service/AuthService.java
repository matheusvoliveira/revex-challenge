package com.revex.challenge.auth.service;

import com.revex.challenge.auth.dto.LoginRequest;
import com.revex.challenge.auth.dto.LoginResponse;
import com.revex.challenge.auth.entity.User;
import com.revex.challenge.auth.repository.UserRepository;
import com.revex.challenge.auth.security.JwtService;
import com.revex.challenge.shared.exception.UnauthorizedException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AuthService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Transactional(readOnly = true)
    public LoginResponse login(LoginRequest request) {
        User user = userRepository.findByUsername(request.username().trim())
                .orElseThrow(() -> new UnauthorizedException("Credenciais inválidas."));
        if (!passwordEncoder.matches(request.password(), user.getPasswordHash())) {
            throw new UnauthorizedException("Credenciais inválidas.");
        }
        return new LoginResponse(jwtService.createToken(user.getUsername()));
    }
}
