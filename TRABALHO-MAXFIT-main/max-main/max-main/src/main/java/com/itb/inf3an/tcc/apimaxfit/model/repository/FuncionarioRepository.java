package com.itb.inf3an.tcc.apimaxfit.model.repository;

import com.itb.inf3an.tcc.apimaxfit.model.entity.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {

    @Query(value = "SELECT * FROM Usuario u WHERE u.id = ?1 AND u.cod_status = '1' AND u.tipo_usuario = 'FUNCIONARIO'", nativeQuery = true)
    Optional<Funcionario> findActiveById(Long id);

    @Query(value = "SELECT * FROM Usuario u WHERE u.cod_status = '1' AND u.tipo_usuario = 'FUNCIONARIO'", nativeQuery = true)
    List<Funcionario> findAllActive();

}
