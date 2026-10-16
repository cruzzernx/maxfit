package com.itb.inf3an.tcc.apimaxfit.security.token;

import com.itb.inf3an.tcc.apimaxfit.security.jwt.JwtService;

import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Component;

@Component
public class TokenValidator {

    private final JwtService jwtService;

    public TokenValidator(JwtService jwtService) {
        this.jwtService = jwtService;
    }

    public void validarIdDoToken(String authHeader, Long idDoRecurso) {

        String token = authHeader.substring(7);
        Long idDoToken = jwtService.extractUserId(token);

        if(!idDoToken.equals(idDoRecurso)) {
            throw new AccessDeniedException("Operação não permitida: ID do token não corresponde ao recurso solicitado");
        }
    }
}
