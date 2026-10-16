package com.itb.inf3an.tcc.apimaxfit.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.itb.inf3an.tcc.apimaxfit.dto.produto.ProdutoRequest;
import com.itb.inf3an.tcc.apimaxfit.model.entity.Produto;
import com.itb.inf3an.tcc.apimaxfit.model.services.ProdutoService;

@RestController
@RequestMapping("/api/v1/produtos")
public class ProdutoController {

    private final ProdutoService produtoService;

    public ProdutoController(ProdutoService produtoService) {
        this.produtoService = produtoService;
    }

    @PostMapping
    public ResponseEntity<Produto> saveProduto(@RequestBody ProdutoRequest produtoRequest) {
        Produto saved = produtoService.save(criarProduto(produtoRequest));
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(saved.getId()).toUri();
        return ResponseEntity.created(uri).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Produto> findById(@PathVariable Long id) {
        return ResponseEntity.ok(produtoService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<Produto>> findAll() {
        return ResponseEntity.ok(produtoService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Produto> updateProduto(@PathVariable Long id, @RequestBody ProdutoRequest produtoRequest) {
        return ResponseEntity.ok(produtoService.update(id, criarProduto(produtoRequest)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteProduto(@PathVariable Long id) {
        produtoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Produto criarProduto(ProdutoRequest request) {
        Produto produto = new Produto();
        produto.setNome(request.getNome());
        produto.setCategoria(request.getCategoria());
        produto.setPreco(request.getPreco());
        produto.setEstoque(request.getEstoque());
        produto.setImagem(request.getImagem());
        return produto;
    }

}
