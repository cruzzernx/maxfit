package com.itb.inf3an.tcc.apimaxfit.controller;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Locale;
import java.util.Map;

/**
 * Endpoint público para validação de códigos de convite.
 * O frontend chama isso antes de permitir o cadastro de Personal ou Admin.
 */
@RestController
@RequestMapping("/api/v1/convite")
public class ConviteController {

    @Value("${app.invite.personal}")
    private String invitePersonal;

    @Value("${app.invite.admin}")
    private String inviteAdmin;

    /**
     * Valida se o código enviado bate com o código configurado para o tipo.
     * tipo = "personal" ou "admin"
     */
    @PostMapping("/validar")
    public ResponseEntity<Map<String, Boolean>> validar(
            @RequestBody Map<String, String> body) {

        String tipo   = body.getOrDefault("tipo", "");
        String codigo = body.getOrDefault("codigo", "");

        boolean valido = switch (tipo.toLowerCase(Locale.ROOT)) {
            case "personal" -> invitePersonal.equals(codigo);
            case "admin"    -> inviteAdmin.equals(codigo);
            default         -> false;
        };

        return ResponseEntity.ok(Map.of("valido", valido));
    }
}
