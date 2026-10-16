package com.itb.inf3an.tcc.apimaxfit.model.enums;

import lombok.AllArgsConstructor;
import lombok.Getter;
import org.springframework.security.core.authority.SimpleGrantedAuthority;


import java.util.List;
import java.util.Set;
import java.util.stream.Collectors;

import static com.itb.inf3an.tcc.apimaxfit.model.enums.Permission.*;


@Getter
@AllArgsConstructor
public enum TipoUsuario {

    ADMIN (
            Set.of(
                ADMIN_READ,
                ADMIN_CREATE,
                ADMIN_UPDATE,
                ADMIN_DELETE,
                ADMIN_LIST,
                ADMIN_MANAGE,
                FUNCIONARIO_READ,
                FUNCIONARIO_CREATE,
                FUNCIONARIO_UPDATE,
                FUNCIONARIO_DELETE,
                FUNCIONARIO_LIST,
                CLIENTE_LIST,
                CLIENTE_READ,
                CLIENTE_UPDATE,
                CLIENTE_MANAGE,
                PERSONAL_CREATE,
                PERSONAL_READ,
                PERSONAL_LIST,
                PERSONAL_UPDATE,
                PERSONAL_DELETE,
                PLANOTREINO_CREATE,
                PLANOTREINO_READ,
                PLANOTREINO_UPDATE,
                PLANOTREINO_DELETE,
                PLANOTREINO_LIST,
                PLANOTREINO_MANAGE,
                EXERCICIO_CREATE,
                EXERCICIO_READ,
                EXERCICIO_UPDATE,
                EXERCICIO_DELETE,
                EXERCICIO_MANAGE,
                DIETA_CREATE,
                DIETA_READ,
                DIETA_UPDATE,
                DIETA_DELETE,
                DIETA_MANAGE,
                PRODUTO_CREATE,
                PRODUTO_READ,
                PRODUTO_UPDATE,
                PRODUTO_DELETE,
                PRODUTO_MANAGE
         )
    ),
    CLIENTE (
            Set.of(
                    CLIENTE_READ,
                    CLIENTE_UPDATE,
                    PLANOTREINO_READ,
                    EXERCICIO_READ,
                    DIETA_READ,
                    PRODUTO_READ
            )
    ),    PERSONAL (
            Set.of(
                    PERSONAL_READ,
                    PERSONAL_LIST,
                    CLIENTE_LIST,
                    CLIENTE_READ,
                    CLIENTE_UPDATE,
                    CLIENTE_MANAGE,
                    PLANOTREINO_CREATE,
                    PLANOTREINO_READ,
                    PLANOTREINO_UPDATE,
                    PLANOTREINO_DELETE,
                    PLANOTREINO_LIST,
                    PLANOTREINO_MANAGE,
                    EXERCICIO_CREATE,
                    EXERCICIO_READ,
                    EXERCICIO_UPDATE,
                    EXERCICIO_DELETE,
                    EXERCICIO_MANAGE,
                    DIETA_CREATE,
                    DIETA_READ,
                    DIETA_UPDATE,
                    DIETA_DELETE,
                    DIETA_MANAGE
            )
    ),
    FUNCIONARIO (
            Set.of(
                    FUNCIONARIO_READ,
                    FUNCIONARIO_UPDATE,
                    CLIENTE_LIST,
                    CLIENTE_READ,
                    CLIENTE_UPDATE,
                    CLIENTE_MANAGE
            )
    );

    private final Set<Permission> permissions;

    // Método que retorna o que cada tipo de usuário poderá realizar no sistema "permissões"

    public List<SimpleGrantedAuthority> getAuthorities() {
        var authorities = getPermissions()
                .stream()
                .map(permission -> new SimpleGrantedAuthority(permission.getPermission()))
                .collect(Collectors.toList());
      authorities.add(new SimpleGrantedAuthority("ROLE_" + this.name()));
      return authorities;
    }


}
