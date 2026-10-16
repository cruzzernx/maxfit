package com.itb.inf3an.tcc.apimaxfit.model.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "PlanoTreinoExercicio")
@Getter
@Setter
@EqualsAndHashCode(onlyExplicitlyIncluded = true)
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PlanoTreinoExercicio {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @EqualsAndHashCode.Include
    private Long id;
  
 
    private boolean codStatus;

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @JoinColumn(name = "planotreino_id", referencedColumnName = "id", nullable = false)
    private PlanoTreino planoTreino;

    @ManyToOne(cascade = CascadeType.MERGE, fetch = FetchType.LAZY)
    @JoinColumn(name = "exercicio_id", referencedColumnName = "id", nullable = false)
    private Exercicio exercicio;

}
