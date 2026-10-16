package com.itb.inf3an.tcc.apimaxfit.dto.auth;

import com.itb.inf3an.tcc.apimaxfit.model.enums.TipoUsuario;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

// Classe responsável pelo cadastro do Usuário (ADMIN, FUNCIONARIO, CLIENTE)

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class RegisterRequest {

    private String nome;
    private String email;
    private String password;
    private TipoUsuario tipoUsuario;
}