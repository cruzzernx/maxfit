package com.itb.inf3an.tcc.apimaxfit.model.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itb.inf3an.tcc.apimaxfit.exceptions.NotFound;
import com.itb.inf3an.tcc.apimaxfit.model.entity.Dieta;
import com.itb.inf3an.tcc.apimaxfit.model.repository.DietaRepository;

@Service
public class DietaService {

    private final DietaRepository dietaRepository;

    public DietaService(DietaRepository dietaRepository) {
        this.dietaRepository = dietaRepository;
    }

    public Dieta findById(Long id) {
        return dietaRepository.findActiveById(id)
                .orElseThrow(() -> new NotFound("Dieta não encontrada com o id " + id));
    }

    public List<Dieta> findAll() {
        return dietaRepository.findAllActive();
    }

    public List<Dieta> findAllByClienteId(Long clienteId) {
        return dietaRepository.findAllActiveByClienteId(clienteId);
    }

    @Transactional
    public Dieta save(Dieta dieta) {
        dieta.setCodStatus(true);
        dieta.getRefeicoes().forEach(r -> r.setDieta(dieta));
        return dietaRepository.save(dieta);
    }

    @Transactional
    public Dieta update(Long id, Dieta dieta) {
        Dieta existing = findById(id);
        existing.setNome(dieta.getNome());
        existing.setObjetivo(dieta.getObjetivo());
        existing.setCalorias(dieta.getCalorias());
        existing.setProteina(dieta.getProteina());
        existing.setCarboidratos(dieta.getCarboidratos());
        existing.setGorduras(dieta.getGorduras());
        if (dieta.getPersonal() != null) {
            existing.setPersonal(dieta.getPersonal());
        }
        if (dieta.getCliente() != null) {
            existing.setCliente(dieta.getCliente());
        }
        // Substitui as refeições por completo (mantém a coleção gerenciada
        // para o orphanRemoval apagar as antigas e persistir as novas)
        existing.getRefeicoes().clear();
        dieta.getRefeicoes().forEach(r -> r.setDieta(existing));
        existing.getRefeicoes().addAll(dieta.getRefeicoes());
        return dietaRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        Dieta existing = findById(id);
        existing.setCodStatus(false);
        dietaRepository.save(existing);
    }

}
