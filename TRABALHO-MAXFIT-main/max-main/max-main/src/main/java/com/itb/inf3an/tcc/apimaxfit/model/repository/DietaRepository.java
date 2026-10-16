package com.itb.inf3an.tcc.apimaxfit.model.repository;

import com.itb.inf3an.tcc.apimaxfit.model.entity.Dieta;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface DietaRepository extends JpaRepository<Dieta, Long> {

    @Query(value = "SELECT * FROM Dieta WHERE id = ?1 AND cod_status = '1'", nativeQuery = true)
    Optional<Dieta> findActiveById(Long id);

    @Query(value = "SELECT * FROM Dieta WHERE cod_status = '1'", nativeQuery = true)
    List<Dieta> findAllActive();

    @Query(value = "SELECT * FROM Dieta WHERE cliente_id = ?1 AND cod_status = '1'", nativeQuery = true)
    List<Dieta> findAllActiveByClienteId(Long clienteId);

}
