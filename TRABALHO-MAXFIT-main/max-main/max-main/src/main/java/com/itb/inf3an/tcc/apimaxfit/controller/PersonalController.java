package com.itb.inf3an.tcc.apimaxfit.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.itb.inf3an.tcc.apimaxfit.auth.AuthenticationService;
import com.itb.inf3an.tcc.apimaxfit.dto.auth.AuthenticationResponse;
import com.itb.inf3an.tcc.apimaxfit.dto.auth.RegisterRequest;
import com.itb.inf3an.tcc.apimaxfit.model.entity.Personal;
import com.itb.inf3an.tcc.apimaxfit.model.enums.TipoUsuario;
import com.itb.inf3an.tcc.apimaxfit.model.services.PersonalService;

@RestController
@RequestMapping("/api/v1/personals")
public class PersonalController {

    private final AuthenticationService authenticationService;
    private final PersonalService personalService;

    public PersonalController(
            AuthenticationService authenticationService,
            PersonalService personalService) {
        this.authenticationService = authenticationService;
        this.personalService = personalService;
    }

    @PostMapping
    public ResponseEntity<AuthenticationResponse> registerPersonal(
            @RequestBody RegisterRequest registerRequest) {

        registerRequest.setTipoUsuario(TipoUsuario.PERSONAL);

        return ResponseEntity.ok(
                authenticationService.register(registerRequest)
        );
    }

    @GetMapping
    public ResponseEntity<List<Personal>> findAll() {
        return ResponseEntity.ok(personalService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Personal> findById(@PathVariable Long id) {
        return ResponseEntity.ok(personalService.findById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Personal> update(
            @PathVariable Long id,
            @RequestBody Personal personal) {

        return ResponseEntity.ok(
                personalService.update(id, personal)
        );
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        personalService.delete(id);
        return ResponseEntity.noContent().build();
    }
}