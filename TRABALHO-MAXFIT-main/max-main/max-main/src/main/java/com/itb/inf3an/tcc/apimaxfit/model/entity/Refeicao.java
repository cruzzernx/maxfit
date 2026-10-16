package com.itb.inf3an.tcc.apimaxfit.model.entity;


import jakarta.persistence.*;
import lombok.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "Refeicao")
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Refeicao {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(nullable = false, length = 10)
    private String horario;

    @Column(nullable = false, length = 40)
    private String nome;

    @Builder.Default
    @ElementCollection
    @CollectionTable(name = "RefeicaoAlimento", joinColumns = @JoinColumn(name = "refeicao_id"))
    @Column(name = "alimento", length = 120)
    private List<String> alimentos = new ArrayList<>();

    @Column(nullable = true)
    private Integer calorias;

    @Column(nullable = true)
    private Integer proteina;

    @Column(nullable = true)
    private Integer carboidratos;

    @Column(nullable = true)
    private Integer gorduras;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "dieta_id", referencedColumnName = "id", nullable = false)
    private Dieta dieta;

}
