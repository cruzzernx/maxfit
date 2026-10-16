package com.itb.inf3an.tcc.apimaxfit.model.services;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.itb.inf3an.tcc.apimaxfit.exceptions.NotFound;
import com.itb.inf3an.tcc.apimaxfit.model.entity.Produto;
import com.itb.inf3an.tcc.apimaxfit.model.repository.ProdutoRepository;

@Service
public class ProdutoService {

    private final ProdutoRepository produtoRepository;

    public ProdutoService(ProdutoRepository produtoRepository) {
        this.produtoRepository = produtoRepository;
    }

    public Produto findById(Long id) {
        return produtoRepository.findActiveById(id)
                .orElseThrow(() -> new NotFound("Produto não encontrado com o id " + id));
    }

    @Transactional
    public Produto save(Produto produto) {
        produto.setCodStatus(true);
        return produtoRepository.save(produto);
    }

    public List<Produto> findAll() {
        return produtoRepository.findAllActive();
    }

    @Transactional
    public Produto update(Long id, Produto produto) {
        Produto existing = findById(id);
        existing.setNome(produto.getNome());
        existing.setCategoria(produto.getCategoria());
        existing.setPreco(produto.getPreco());
        existing.setEstoque(produto.getEstoque());
        existing.setImagem(produto.getImagem());
        return produtoRepository.save(existing);
    }

    @Transactional
    public void delete(Long id) {
        Produto existing = findById(id);
        existing.setCodStatus(false);
        produtoRepository.save(existing);
    }

}
