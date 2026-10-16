package com.itb.inf3an.tcc.apimaxfit.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.itb.inf3an.tcc.apimaxfit.auth.AuthenticationService;
import com.itb.inf3an.tcc.apimaxfit.dto.auth.AuthenticationResponse;
import com.itb.inf3an.tcc.apimaxfit.dto.auth.RegisterRequest;
import com.itb.inf3an.tcc.apimaxfit.model.entity.Cliente;
import com.itb.inf3an.tcc.apimaxfit.model.enums.TipoUsuario;
import com.itb.inf3an.tcc.apimaxfit.model.services.ClienteService;

@RestController
@RequestMapping("/api/v1/clientes")
public class ClienteController {

    private final AuthenticationService authenticationService;
    private final ClienteService clienteService;

    public ClienteController(AuthenticationService authenticationService, ClienteService clienteService) {
        this.authenticationService = authenticationService;
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<AuthenticationResponse> registerCliente(@RequestBody RegisterRequest registerRequest) {
        registerRequest.setTipoUsuario(TipoUsuario.CLIENTE);
        return ResponseEntity.ok(authenticationService.register(registerRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Cliente> findById(@PathVariable Long id) {
        return ResponseEntity.ok(clienteService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<Cliente>> findAll() {
        return ResponseEntity.ok(clienteService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Cliente> updateCliente(@PathVariable Long id, @RequestBody Cliente clienteRequest) {
        return ResponseEntity.ok(clienteService.update(id, clienteRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteCliente(@PathVariable Long id) {
        clienteService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
