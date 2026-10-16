package com.itb.inf3an.tcc.apimaxfit.model.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itb.inf3an.tcc.apimaxfit.exceptions.NotFound;
import com.itb.inf3an.tcc.apimaxfit.model.entity.Personal;
import com.itb.inf3an.tcc.apimaxfit.model.repository.PersonalRepository;

@Service
public class PersonalService {

    private final PersonalRepository personalRepository;

    public PersonalService(PersonalRepository personalRepository) {
        this.personalRepository = personalRepository;
    }

    public Personal findById(Long id) {
        return personalRepository.findById(id)
                .orElseThrow(() -> new NotFound("Personal não encontrado com o id " + id));
    }

    public List<Personal> findAll() {
        return personalRepository.findAllActive();
    }

    @Transactional
    public Personal update(Long id, Personal personal) {
        Personal existing = findById(id);

        existing.setNome(personal.getNome());
        existing.setCpf(personal.getCpf());
        existing.setSexo(personal.getSexo());
        existing.setDataNascimento(personal.getDataNascimento());
        existing.setLogradouro(personal.getLogradouro());
        existing.setCep(personal.getCep());
        existing.setBairro(personal.getBairro());
        existing.setCidade(personal.getCidade());
        existing.setUf(personal.getUf());
        existing.setChn(personal.getChn());

        return personalRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        Personal existing = findById(id);
        existing.setCodStatus(false);
        personalRepository.save(existing);
    }
}