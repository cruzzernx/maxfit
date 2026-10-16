package com.itb.inf3an.tcc.apimaxfit.model.services;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itb.inf3an.tcc.apimaxfit.exceptions.NotFound;
import com.itb.inf3an.tcc.apimaxfit.model.entity.PlanoTreino;
import com.itb.inf3an.tcc.apimaxfit.model.repository.PlanoTreinoRepository;



@Service
public class PlanoTreinoService {

    private final PlanoTreinoRepository planoTreinoRepository;

    public PlanoTreinoService(PlanoTreinoRepository planoTreinoRepository) {
        this.planoTreinoRepository = planoTreinoRepository;
    }

    public PlanoTreino findById(Long id) {
        return planoTreinoRepository.findActiveById(id)
                .orElseThrow(() -> new NotFound("Plano de Treino não encontrado com o id " + id));
    }

    @Transactional
    public PlanoTreino save(PlanoTreino planoTreino) {
        planoTreino.setCodStatus(true);
        return planoTreinoRepository.save(planoTreino);
    }

    public List<PlanoTreino> findAll() {
        return planoTreinoRepository.findAllActive();
    }

    @Transactional
    public PlanoTreino update(Long id, PlanoTreino planoTreino) {
        PlanoTreino existing = findById(id);
        existing.setNome(planoTreino.getNome());
        existing.setGrupoMuscular(planoTreino.getGrupoMuscular());
        existing.setNivel(planoTreino.getNivel());
        existing.setDescricao(planoTreino.getDescricao());
        existing.setDataInicio(planoTreino.getDataInicio());
        existing.setDataFim(planoTreino.getDataFim());
        existing.setStatus(planoTreino.getStatus());
        if (planoTreino.getPersonal() != null) {
            existing.setPersonal(planoTreino.getPersonal());
        }
        if (planoTreino.getCliente() != null) {
            existing.setCliente(planoTreino.getCliente());
        }
        return planoTreinoRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        PlanoTreino existing = findById(id);
        existing.setCodStatus(false);
        planoTreinoRepository.save(existing);
    }

}
