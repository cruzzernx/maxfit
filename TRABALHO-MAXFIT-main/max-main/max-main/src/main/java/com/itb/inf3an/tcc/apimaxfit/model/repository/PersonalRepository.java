package com.itb.inf3an.tcc.apimaxfit.model.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import com.itb.inf3an.tcc.apimaxfit.model.entity.Personal;
import com.itb.inf3an.tcc.apimaxfit.model.entity.PlanoTreino;

@Repository
public interface PersonalRepository extends JpaRepository<Personal, Long> {

    @Query(value = "SELECT * FROM Usuario u WHERE u.id = ?1 AND u.cod_status = 1 AND u.tipo_usuario = 'PERSONAL'", nativeQuery = true)
    Optional<Personal> findById(Long id);

    @Query(value = "SELECT * FROM Usuario u WHERE u.cod_status = 1 AND u.tipo_usuario = 'PERSONAL'", nativeQuery = true)
    List<Personal> findAllActive();

    @Query("SELECT pt FROM PlanoTreino pt JOIN FETCH pt.personal p WHERE p.id = :id")
    List<PlanoTreino> findAllPlanoTreinoByPersonalId(@Param("id") Long personalId);
}