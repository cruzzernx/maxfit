package com.itb.inf3an.tcc.apimaxfit.model.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itb.inf3an.tcc.apimaxfit.exceptions.NotFound;
import com.itb.inf3an.tcc.apimaxfit.model.entity.Cliente;
import com.itb.inf3an.tcc.apimaxfit.model.repository.ClienteRepository;

@Service
public class ClienteService {

    private final ClienteRepository clienteRepository;

    public ClienteService(ClienteRepository clienteRepository) {
        this.clienteRepository = clienteRepository;
    }

    public Cliente findById(Long id) {
        return clienteRepository.findActiveById(id)
                .orElseThrow(() -> new NotFound("Cliente não encontrado com o id " + id));
    }

    public List<Cliente> findAll() {
        return clienteRepository.findAllActive();
    }

    @Transactional
    public Cliente update(Long id, Cliente cliente) {
        Cliente existing = findById(id);
        existing.setNome(cliente.getNome());
        existing.setCpf(cliente.getCpf());
        existing.setSexo(cliente.getSexo());
        existing.setDataNascimento(cliente.getDataNascimento());
        existing.setLogradouro(cliente.getLogradouro());
        existing.setCep(cliente.getCep());
        existing.setBairro(cliente.getBairro());
        existing.setCidade(cliente.getCidade());
        existing.setUf(cliente.getUf());
        existing.setNumeroPontos(cliente.getNumeroPontos());
        return clienteRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        Cliente existing = findById(id);
        existing.setCodStatus(false);
        clienteRepository.save(existing);
    }

}
