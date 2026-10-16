package com.itb.inf3an.tcc.apimaxfit.model.repository;


import com.itb.inf3an.tcc.apimaxfit.model.entity.PlanoTreinoExercicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlanoTreinoExercicioRepository extends JpaRepository<PlanoTreinoExercicio, Long> {

    @Query("SELECT pte FROM PlanoTreinoExercicio pte JOIN FETCH pte.exercicio WHERE pte.planoTreino.id = :planoTreinoId AND pte.codStatus = true")
    List<PlanoTreinoExercicio> findAllByPlanoTreinoId(@Param("planoTreinoId") Long planoTreinoId);

    @Query("SELECT pte FROM PlanoTreinoExercicio pte WHERE pte.planoTreino.id = :planoTreinoId AND pte.exercicio.id = :exercicioId AND pte.codStatus = true")
    Optional<PlanoTreinoExercicio> findActiveByPlanoTreinoIdAndExercicioId(@Param("planoTreinoId") Long planoTreinoId, @Param("exercicioId") Long exercicioId);

}
