package com.itb.inf3an.tcc.apimaxfit.model.repository;

import com.itb.inf3an.tcc.apimaxfit.model.entity.Exercicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import com.itb.inf3an.tcc.apimaxfit.model.entity.PlanoTreino;

import java.util.List;
import java.util.Optional;

@Repository
public interface PlanoTreinoRepository extends JpaRepository<PlanoTreino, Long> {

    @Query(value = "SELECT * FROM PlanoTreino WHERE id = ?1 AND cod_status = '1'", nativeQuery = true)
    Optional<PlanoTreino> findActiveById(Long id);

    @Query(value = "SELECT * FROM PlanoTreino WHERE cod_status = '1'", nativeQuery = true)
    List<PlanoTreino> findAllActive();

}
