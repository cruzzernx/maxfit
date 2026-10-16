package com.itb.inf3an.tcc.apimaxfit.model.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itb.inf3an.tcc.apimaxfit.exceptions.NotFound;
import com.itb.inf3an.tcc.apimaxfit.model.entity.Admin;
import com.itb.inf3an.tcc.apimaxfit.model.repository.AdminRepository;

@Service
public class AdminService {

    private final AdminRepository adminRepository;

    public AdminService(AdminRepository adminRepository) {
        this.adminRepository = adminRepository;
    }

    public Admin findById(Long id) {
        return adminRepository.findActiveById(id)
                .orElseThrow(() -> new NotFound("Admin não encontrado com o id " + id));
    }

    public List<Admin> findAll() {
        return adminRepository.findAllActive();
    }

    @Transactional
    public Admin update(Long id, Admin admin) {
        Admin existing = findById(id);
        existing.setNome(admin.getNome());
        existing.setCpf(admin.getCpf());
        existing.setSexo(admin.getSexo());
        existing.setDataNascimento(admin.getDataNascimento());
        existing.setLogradouro(admin.getLogradouro());
        existing.setCep(admin.getCep());
        existing.setBairro(admin.getBairro());
        existing.setCidade(admin.getCidade());
        existing.setUf(admin.getUf());
        existing.setNivelAcesso(admin.getNivelAcesso());
        return adminRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        Admin existing = findById(id);
        existing.setCodStatus(false);
        adminRepository.save(existing);
    }

}
