package com.itb.inf3an.tcc.apimaxfit.model.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Dieta")
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Dieta {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false, length = 60)
    private String nome;

    @Column(nullable = false, length = 30)
    private String objetivo;

    @Column(nullable = false)
    private Integer calorias;

    @Column(nullable = true)
    private Integer proteina;

    @Column(nullable = true)
    private Integer carboidratos;

    @Column(nullable = true)
    private Integer gorduras;

    private boolean codStatus;

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "personal_id", referencedColumnName = "id", nullable = true)
    private Personal personal;

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", referencedColumnName = "id", nullable = true)
    private Cliente cliente;

    @Builder.Default
    @OneToMany(mappedBy = "dieta", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<Refeicao> refeicoes = new ArrayList<>();

}
