package com.itb.inf3an.tcc.apimaxfit.model.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itb.inf3an.tcc.apimaxfit.exceptions.NotFound;
import com.itb.inf3an.tcc.apimaxfit.model.entity.Funcionario;
import com.itb.inf3an.tcc.apimaxfit.model.repository.FuncionarioRepository;

@Service
public class FuncionarioService {

    private final FuncionarioRepository funcionarioRepository;

    public FuncionarioService(FuncionarioRepository funcionarioRepository) {
        this.funcionarioRepository = funcionarioRepository;
    }

    public Funcionario findById(Long id) {
        return funcionarioRepository.findActiveById(id)
                .orElseThrow(() -> new NotFound("Funcionário não encontrado com o id " + id));
    }

    public List<Funcionario> findAll() {
        return funcionarioRepository.findAllActive();
    }

    @Transactional
    public Funcionario update(Long id, Funcionario funcionario) {
        Funcionario existing = findById(id);
        existing.setNome(funcionario.getNome());
        existing.setCpf(funcionario.getCpf());
        existing.setSexo(funcionario.getSexo());
        existing.setDataNascimento(funcionario.getDataNascimento());
        existing.setLogradouro(funcionario.getLogradouro());
        existing.setCep(funcionario.getCep());
        existing.setBairro(funcionario.getBairro());
        existing.setCidade(funcionario.getCidade());
        existing.setUf(funcionario.getUf());
        existing.setChn(funcionario.getChn());
        return funcionarioRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        Funcionario existing = findById(id);
        existing.setCodStatus(false);
        funcionarioRepository.save(existing);
    }

}
