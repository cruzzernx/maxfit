package com.itb.inf3an.tcc.apimaxfit.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.itb.inf3an.tcc.apimaxfit.auth.AuthenticationService;
import com.itb.inf3an.tcc.apimaxfit.dto.auth.AuthenticationResponse;
import com.itb.inf3an.tcc.apimaxfit.dto.auth.RegisterRequest;
import com.itb.inf3an.tcc.apimaxfit.model.entity.Funcionario;
import com.itb.inf3an.tcc.apimaxfit.model.enums.TipoUsuario;
import com.itb.inf3an.tcc.apimaxfit.model.services.FuncionarioService;

@RestController
@RequestMapping("/api/v1/funcionarios")
public class FuncionarioController {

    private final AuthenticationService authenticationService;
    private final FuncionarioService funcionarioService;

    public FuncionarioController(AuthenticationService authenticationService, FuncionarioService funcionarioService) {
        this.authenticationService = authenticationService;
        this.funcionarioService = funcionarioService;
    }

    @PostMapping
    public ResponseEntity<AuthenticationResponse> registerFuncionario(@RequestBody RegisterRequest registerRequest) {
        registerRequest.setTipoUsuario(TipoUsuario.FUNCIONARIO);
        return ResponseEntity.ok(authenticationService.register(registerRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Funcionario> findById(@PathVariable Long id) {
        return ResponseEntity.ok(funcionarioService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<Funcionario>> findAll() {
        return ResponseEntity.ok(funcionarioService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Funcionario> updateFuncionario(@PathVariable Long id, @RequestBody Funcionario funcionarioRequest) {
        return ResponseEntity.ok(funcionarioService.update(id, funcionarioRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteFuncionario(@PathVariable Long id) {
        funcionarioService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
