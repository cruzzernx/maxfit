package com.itb.inf3an.tcc.apimaxfit.model.repository;


import com.itb.inf3an.tcc.apimaxfit.model.entity.Admin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AdminRepository extends JpaRepository<Admin, Long> {

    @Query(value = "SELECT * FROM Usuario u WHERE u.id = ?1 AND u.cod_status = '1' AND u.tipo_usuario = 'ADMIN'", nativeQuery = true)
    Optional<Admin> findActiveById(Long id);

    @Query(value = "SELECT * FROM Usuario u WHERE u.cod_status = '1' AND u.tipo_usuario = 'ADMIN'", nativeQuery = true)
    List<Admin> findAllActive();

}
