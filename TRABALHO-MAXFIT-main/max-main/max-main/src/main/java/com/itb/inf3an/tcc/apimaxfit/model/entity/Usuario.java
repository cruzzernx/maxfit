package com.itb.inf3an.tcc.apimaxfit.model.entity;

import com.itb.inf3an.tcc.apimaxfit.model.enums.TipoUsuario;
import jakarta.persistence.*;
import lombok.*;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.time.LocalDate;
import java.util.Collection;
import java.util.List;

@Entity
@Table(name = "Usuario")
@Inheritance(strategy = InheritanceType.SINGLE_TABLE)
@DiscriminatorColumn(name = "tipo_usuario", discriminatorType = DiscriminatorType.STRING)
@Setter // Atribui informação ao atributo
@Getter // Recupera a informação do atributo
@EqualsAndHashCode(onlyExplicitlyIncluded = true) // Otimizar a busca dentro de coleções e evitar duplicidade de objetos
@NoArgsConstructor   // Construtor sem parâmetros (padrão)
@AllArgsConstructor  // Construtor com todos parâmetros
@Builder             // Forma otimizada para criação de objetos
public class Usuario implements UserDetails {

    @Id   // Chave Primária
    @GeneratedValue(strategy = GenerationType.IDENTITY) // Auto-Increment (identificado de 1 em 1 )
    @EqualsAndHashCode.Include
    private Long id;
    @Column(length = 100, nullable = true)
    private String nome;
    @Column(length = 15, nullable = true)
    private String cpf;
    @Column(length = 45, nullable = false)
    private String email;
    @Column(length = 255, nullable = false)
    private String password;
    @Column(length = 15, nullable = true)
    private String sexo;
    @Column(nullable = true)
    private LocalDate dataNascimento;
    @Column(length = 100, nullable = true)
    private String logradouro;
    @Column(length = 10, nullable = true)
    private String cep;
    @Column(length = 45, nullable = true)
    private String bairro;
    @Column(length = 45, nullable = true)
    private String cidade;
    @Column(length = 2, nullable = true)
    private String uf;
    private boolean codStatus;

    @Enumerated(EnumType.STRING)
    @Column(length = 20, name = "tipo_usuario",  insertable = false, updatable = false)
    private TipoUsuario tipoUsuario;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return tipoUsuario.getAuthorities();
    }

    @Override
    public String getUsername() {
        return email;
    }

    @Override
    public boolean isAccountNonExpired() {
        return true;
    }

    @Override
    public boolean isAccountNonLocked() {
        return true;
    }

    @Override
    public boolean isCredentialsNonExpired() {
        return true;
    }

    @Override
    public boolean isEnabled() {
        return true;
    }
}
