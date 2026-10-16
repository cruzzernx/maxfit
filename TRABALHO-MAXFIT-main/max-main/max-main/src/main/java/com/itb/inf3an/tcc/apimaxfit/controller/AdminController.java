package com.itb.inf3an.tcc.apimaxfit.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.itb.inf3an.tcc.apimaxfit.auth.AuthenticationService;
import com.itb.inf3an.tcc.apimaxfit.dto.auth.AuthenticationResponse;
import com.itb.inf3an.tcc.apimaxfit.dto.auth.RegisterRequest;
import com.itb.inf3an.tcc.apimaxfit.model.entity.Admin;
import com.itb.inf3an.tcc.apimaxfit.model.enums.TipoUsuario;
import com.itb.inf3an.tcc.apimaxfit.model.services.AdminService;

@RestController
@RequestMapping("/api/v1/admins")
public class AdminController {

    private final AuthenticationService authenticationService;
    private final AdminService adminService;

    public AdminController(AuthenticationService authenticationService, AdminService adminService) {
        this.authenticationService = authenticationService;
        this.adminService = adminService;
    }

    @PostMapping
    public ResponseEntity<AuthenticationResponse> registerAdmin(@RequestBody RegisterRequest registerRequest) {
        registerRequest.setTipoUsuario(TipoUsuario.ADMIN);
        return ResponseEntity.ok(authenticationService.register(registerRequest));
    }

    @GetMapping("/{id}")
    public ResponseEntity<Admin> findById(@PathVariable Long id) {
        return ResponseEntity.ok(adminService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<Admin>> findAll() {
        return ResponseEntity.ok(adminService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Admin> updateAdmin(@PathVariable Long id, @RequestBody Admin adminRequest) {
        return ResponseEntity.ok(adminService.update(id, adminRequest));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAdmin(@PathVariable Long id) {
        adminService.delete(id);
        return ResponseEntity.noContent().build();
    }

}
