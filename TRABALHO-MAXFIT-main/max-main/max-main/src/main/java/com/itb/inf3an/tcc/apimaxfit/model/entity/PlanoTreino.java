package com.itb.inf3an.tcc.apimaxfit.model.entity;


import jakarta.persistence.*;
import lombok.*;


import java.time.LocalDate;

@Entity
@Table(name = "PlanoTreino")
@Setter
@Getter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanoTreino {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;

    @Column(length = 20, nullable = false)
     private String nome;

        @Column(length = 30, nullable = false)
     private String grupoMuscular;

        @Column(length = 20, nullable = false)
     private String nivel;


     @Column(length = 255, nullable = true)
     private String descricao;
    

    @Column(nullable = false)
    private LocalDate dataInicio;
    @Column(nullable = false)
    private LocalDate dataFim;
  
    @Column(length = 20, nullable = false)
    private String status;

    // Relacionamento "Associação"
    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "personal_id", referencedColumnName = "id", nullable = false)
    private Personal personal;

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.EAGER)
    @JoinColumn(name = "cliente_id", referencedColumnName = "id", nullable = true)
    private Cliente cliente;

    private boolean codStatus;

}
