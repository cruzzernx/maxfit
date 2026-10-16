package com.itb.inf3an.tcc.apimaxfit.controller;

import java.net.URI;
import java.util.List;
import java.util.stream.Collectors;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;

import com.itb.inf3an.tcc.apimaxfit.dto.dieta.DietaRequest;
import com.itb.inf3an.tcc.apimaxfit.dto.dieta.RefeicaoRequest;
import com.itb.inf3an.tcc.apimaxfit.exceptions.BadRequest;
import com.itb.inf3an.tcc.apimaxfit.model.entity.Cliente;
import com.itb.inf3an.tcc.apimaxfit.model.entity.Dieta;
import com.itb.inf3an.tcc.apimaxfit.model.entity.Personal;
import com.itb.inf3an.tcc.apimaxfit.model.entity.Refeicao;
import com.itb.inf3an.tcc.apimaxfit.model.services.ClienteService;
import com.itb.inf3an.tcc.apimaxfit.model.services.DietaService;
import com.itb.inf3an.tcc.apimaxfit.model.services.PersonalService;

@RestController
@RequestMapping("/api/v1/dietas")
public class DietaController {

    private final DietaService dietaService;
    private final PersonalService personalService;
    private final ClienteService clienteService;

    public DietaController(DietaService dietaService, PersonalService personalService, ClienteService clienteService) {
        this.dietaService = dietaService;
        this.personalService = personalService;
        this.clienteService = clienteService;
    }

    @PostMapping
    public ResponseEntity<Dieta> saveDieta(@RequestBody DietaRequest dietaRequest) {
        Dieta saved = dietaService.save(criarDieta(dietaRequest));
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(saved.getId()).toUri();
        return ResponseEntity.created(uri).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Dieta> findById(@PathVariable Long id) {
        return ResponseEntity.ok(dietaService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<Dieta>> findAll() {
        return ResponseEntity.ok(dietaService.findAll());
    }

    @GetMapping("/cliente/{clienteId}")
    public ResponseEntity<List<Dieta>> findByCliente(@PathVariable Long clienteId) {
        return ResponseEntity.ok(dietaService.findAllByClienteId(clienteId));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Dieta> updateDieta(@PathVariable Long id, @RequestBody DietaRequest dietaRequest) {
        return ResponseEntity.ok(dietaService.update(id, criarDieta(dietaRequest)));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteDieta(@PathVariable Long id) {
        dietaService.delete(id);
        return ResponseEntity.noContent().build();
    }

    private Dieta criarDieta(DietaRequest request) {
        Dieta dieta = new Dieta();
        dieta.setNome(request.getNome());
        dieta.setObjetivo(request.getObjetivo());
        dieta.setCalorias(request.getCalorias());
        dieta.setProteina(request.getProteina());
        dieta.setCarboidratos(request.getCarboidratos());
        dieta.setGorduras(request.getGorduras());

        if (request.getClienteId() == null) {
            throw new BadRequest("O campo clienteId é obrigatório para criar uma dieta");
        }
        Cliente cliente = clienteService.findById(request.getClienteId());
        dieta.setCliente(cliente);

        if (request.getPersonalId() != null) {
            Personal personal = personalService.findById(request.getPersonalId());
            dieta.setPersonal(personal);
        }

        if (request.getRefeicoes() != null) {
            dieta.setRefeicoes(request.getRefeicoes().stream()
                    .map(this::criarRefeicao)
                    .collect(Collectors.toList()));
        }

        return dieta;
    }

    private Refeicao criarRefeicao(RefeicaoRequest request) {
        Refeicao refeicao = new Refeicao();
        refeicao.setHorario(request.getHorario());
        refeicao.setNome(request.getNome());
        refeicao.setAlimentos(request.getAlimentos());
        refeicao.setCalorias(request.getCalorias());
        refeicao.setProteina(request.getProteina());
        refeicao.setCarboidratos(request.getCarboidratos());
        refeicao.setGorduras(request.getGorduras());
        return refeicao;
    }

}
