package com.itb.inf3an.tcc.apimaxfit.model.repository;

import com.itb.inf3an.tcc.apimaxfit.model.entity.Exercicio;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ExercicioRepository extends JpaRepository<Exercicio, Long> {

    @Query(value = "SELECT * FROM Exercicio WHERE id = ?1 AND cod_status = '1'", nativeQuery = true)
    Optional<Exercicio> findActiveById(Long id);

    @Query(value = "SELECT * FROM Exercicio WHERE cod_status = '1'", nativeQuery = true)
    List<Exercicio> findAllActive();

}
