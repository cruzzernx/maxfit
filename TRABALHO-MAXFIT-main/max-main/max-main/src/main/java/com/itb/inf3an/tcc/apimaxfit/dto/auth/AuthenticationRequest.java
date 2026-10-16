package com.itb.inf3an.tcc.apimaxfit.dto.auth;

// Classe responsável para efetuar o login de usuário

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Setter
@Getter
@NoArgsConstructor
@AllArgsConstructor
public class AuthenticationRequest {

    private String email;
    private String password;


}
