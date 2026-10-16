package com.itb.inf3an.tcc.apimaxfit.model.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itb.inf3an.tcc.apimaxfit.exceptions.BadRequest;
import com.itb.inf3an.tcc.apimaxfit.exceptions.NotFound;
import com.itb.inf3an.tcc.apimaxfit.model.entity.Exercicio;
import com.itb.inf3an.tcc.apimaxfit.model.entity.PlanoTreino;
import com.itb.inf3an.tcc.apimaxfit.model.entity.PlanoTreinoExercicio;
import com.itb.inf3an.tcc.apimaxfit.model.repository.PlanoTreinoExercicioRepository;

@Service
public class PlanoTreinoExercicioService {

    private final PlanoTreinoExercicioRepository planoTreinoExercicioRepository;
    private final PlanoTreinoService planoTreinoService;
    private final ExercicioService exercicioService;

    public PlanoTreinoExercicioService(PlanoTreinoExercicioRepository planoTreinoExercicioRepository,
                                       PlanoTreinoService planoTreinoService,
                                       ExercicioService exercicioService) {
        this.planoTreinoExercicioRepository = planoTreinoExercicioRepository;
        this.planoTreinoService = planoTreinoService;
        this.exercicioService = exercicioService;
    }

    @Transactional
    public PlanoTreinoExercicio addExercicio(Long planoTreinoId, Long exercicioId) {
        PlanoTreino planoTreino = planoTreinoService.findById(planoTreinoId);
        Exercicio exercicio = exercicioService.findById(exercicioId);

        planoTreinoExercicioRepository.findActiveByPlanoTreinoIdAndExercicioId(planoTreinoId, exercicioId)
                .ifPresent(pte -> {
                    throw new BadRequest("Exercício já adicionado a este plano de treino");
                });

        PlanoTreinoExercicio planoTreinoExercicio = new PlanoTreinoExercicio();
        planoTreinoExercicio.setPlanoTreino(planoTreino);
        planoTreinoExercicio.setExercicio(exercicio);
        planoTreinoExercicio.setCodStatus(true);

        return planoTreinoExercicioRepository.save(planoTreinoExercicio);
    }

    @Transactional
    public void removeExercicio(Long planoTreinoId, Long exercicioId) {
        PlanoTreinoExercicio planoTreinoExercicio = planoTreinoExercicioRepository
                .findActiveByPlanoTreinoIdAndExercicioId(planoTreinoId, exercicioId)
                .orElseThrow(() -> new NotFound("Exercício não encontrado neste plano de treino"));

        planoTreinoExercicioRepository.delete(planoTreinoExercicio);
    }

    public List<PlanoTreinoExercicio> findAllByPlanoTreinoId(Long planoTreinoId) {
        planoTreinoService.findById(planoTreinoId);
        return planoTreinoExercicioRepository.findAllByPlanoTreinoId(planoTreinoId);
    }

}
