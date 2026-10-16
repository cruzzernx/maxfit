package com.itb.inf3an.tcc.apimaxfit.model.repository;

import com.itb.inf3an.tcc.apimaxfit.model.entity.Produto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProdutoRepository extends JpaRepository<Produto, Long> {

    @Query(value = "SELECT * FROM Produto WHERE id = ?1 AND cod_status = '1'", nativeQuery = true)
    Optional<Produto> findActiveById(Long id);

    @Query(value = "SELECT * FROM Produto WHERE cod_status = '1'", nativeQuery = true)
    List<Produto> findAllActive();

}
