package com.itb.inf3an.tcc.apimaxfit.controller;

import java.net.URI;
import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;


import com.itb.inf3an.tcc.apimaxfit.dto.planoTreino.PlanoTreinoRequest;
import com.itb.inf3an.tcc.apimaxfit.exceptions.BadRequest;
import com.itb.inf3an.tcc.apimaxfit.model.entity.Cliente;
import com.itb.inf3an.tcc.apimaxfit.model.entity.Personal;
import com.itb.inf3an.tcc.apimaxfit.model.entity.PlanoTreino;
import com.itb.inf3an.tcc.apimaxfit.model.entity.PlanoTreinoExercicio;
import com.itb.inf3an.tcc.apimaxfit.model.services.ClienteService;
import com.itb.inf3an.tcc.apimaxfit.model.services.PersonalService;
import com.itb.inf3an.tcc.apimaxfit.model.services.PlanoTreinoExercicioService;
import com.itb.inf3an.tcc.apimaxfit.model.services.PlanoTreinoService;

@RestController
@RequestMapping("/api/v1/planotreinos")
public class PlanoTreinoController {

    private final PlanoTreinoService planoTreinoService;
    private final PersonalService personalService;
    private final ClienteService clienteService;
    private final PlanoTreinoExercicioService planoTreinoExercicioService;

    public PlanoTreinoController(PlanoTreinoService planoTreinoService,
                                 PersonalService personalService,
                                 ClienteService clienteService,
                                 PlanoTreinoExercicioService planoTreinoExercicioService) {
        this.personalService = personalService;
        this.clienteService = clienteService;
        this.planoTreinoService = planoTreinoService;
        this.planoTreinoExercicioService = planoTreinoExercicioService;
    }

    @PostMapping
    public ResponseEntity<PlanoTreino> savePlanoTreino(@RequestBody PlanoTreinoRequest planoTreinoRequest) {
        PlanoTreino saved = planoTreinoService.save(criarPlanoTreino(planoTreinoRequest));
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(saved.getId()).toUri();
        return ResponseEntity.created(uri).body(saved);
    }

    @GetMapping("/{id}")
    public ResponseEntity<PlanoTreino> findById(@PathVariable Long id) {
        return ResponseEntity.ok(planoTreinoService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<PlanoTreino>> findAll() {
        return ResponseEntity.ok(planoTreinoService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<PlanoTreino> updatePlanoTreino(@PathVariable Long id, @RequestBody PlanoTreinoRequest planoTreinoRequest) {
        PlanoTreino planoTreino = criarPlanoTreino(planoTreinoRequest);
        return ResponseEntity.ok(planoTreinoService.update(id, planoTreino));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlanoTreino(@PathVariable Long id) {
        planoTreinoService.delete(id);
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{planoTreinoId}/exercicios/{exercicioId}")
    public ResponseEntity<PlanoTreinoExercicio> addExercicio(@PathVariable Long planoTreinoId, @PathVariable Long exercicioId) {
        return ResponseEntity.ok(planoTreinoExercicioService.addExercicio(planoTreinoId, exercicioId));
    }

    @DeleteMapping("/{planoTreinoId}/exercicios/{exercicioId}")
    public ResponseEntity<Void> removeExercicio(@PathVariable Long planoTreinoId, @PathVariable Long exercicioId) {
        planoTreinoExercicioService.removeExercicio(planoTreinoId, exercicioId);
        return ResponseEntity.noContent().build();
    }

    @GetMapping("/{planoTreinoId}/exercicios")
    public ResponseEntity<List<PlanoTreinoExercicio>> findExercicios(@PathVariable Long planoTreinoId) {
        return ResponseEntity.ok(planoTreinoExercicioService.findAllByPlanoTreinoId(planoTreinoId));
    }


    private PlanoTreino criarPlanoTreino(PlanoTreinoRequest planoTreinoRequest) {

        PlanoTreino planoTreino = new PlanoTreino();

        planoTreino.setNome(planoTreinoRequest.getNome());
        planoTreino.setDescricao(planoTreinoRequest.getDescricao());
        planoTreino.setDataInicio(planoTreinoRequest.getDataInicio());
        planoTreino.setDataFim(planoTreinoRequest.getDataFim());
        planoTreino.setGrupoMuscular(planoTreinoRequest.getGrupoMuscular());
        planoTreino.setNivel(planoTreinoRequest.getNivel());
        planoTreino.setStatus(planoTreinoRequest.getStatus());

        if (planoTreinoRequest.getPersonalId() == null) {
            throw new BadRequest("O campo personalId é obrigatório para criar um plano de treino");
        }

        if (planoTreinoRequest.getPersonalId() != null) {
            Personal personal = personalService.findById(planoTreinoRequest.getPersonalId());
            planoTreino.setPersonal(personal);
        }

        if (planoTreinoRequest.getClienteId() != null) {
            Cliente cliente = clienteService.findById(planoTreinoRequest.getClienteId());
            planoTreino.setCliente(cliente);
        }

        return planoTreino;
    }

}
