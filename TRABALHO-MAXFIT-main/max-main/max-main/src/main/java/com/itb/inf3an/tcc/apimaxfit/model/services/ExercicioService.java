package com.itb.inf3an.tcc.apimaxfit.model.services;

import java.util.List;

import com.itb.inf3an.tcc.apimaxfit.exceptions.NotFound;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itb.inf3an.tcc.apimaxfit.model.entity.Exercicio;
import com.itb.inf3an.tcc.apimaxfit.model.repository.ExercicioRepository;



@Service
public class ExercicioService {

    private final ExercicioRepository exercicioRepository;
  

    
    public ExercicioService(ExercicioRepository produtoRepository) {
        this.exercicioRepository = produtoRepository; 
    
    }


public Exercicio findById(Long id) {

    return exercicioRepository.findActiveById(id)
            .orElseThrow(() -> new NotFound("Exercicio não encontrado com o id " + id));

}

@Transactional
public Exercicio save(Exercicio exercicio) {
   exercicio.setCodStatus(true);
   return exercicioRepository.save(exercicio);
}

public List<Exercicio> findAll() {
    return exercicioRepository.findAllActive();
}

@Transactional
public Exercicio update(Long id, Exercicio exercicio) {
    Exercicio existing = findById(id);
    existing.setNome(exercicio.getNome());
    existing.setDescricao(exercicio.getDescricao());
    existing.setTipo(exercicio.getTipo());
    return exercicioRepository.save(existing);
}

@Transactional
public void delete(Long id) {
    Exercicio existing = findById(id);
    existing.setCodStatus(false);
    exercicioRepository.save(existing);
}



}
