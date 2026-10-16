package com.itb.inf3an.tcc.apimaxfit.controller;

import com.itb.inf3an.tcc.apimaxfit.dto.exercicio.ExercicioRequest;
import com.itb.inf3an.tcc.apimaxfit.model.entity.Exercicio;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



import com.itb.inf3an.tcc.apimaxfit.model.services.ExercicioService;

import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import java.net.URI;
import java.util.List;


@RestController
@RequestMapping("/api/v1/exercicios")
public class ExercicioController {


    private final ExercicioService exercicioService;
 

    public ExercicioController(ExercicioService exercicioService) {
        this.exercicioService = exercicioService;
      
    }


    @PostMapping
    public ResponseEntity<Exercicio> saveExercicio(@RequestBody ExercicioRequest exercicioRequest) {
        Exercicio produto = criarExercicio(exercicioRequest);
        Exercicio saved = exercicioService.save(produto);
        URI uri = ServletUriComponentsBuilder.fromCurrentRequest()
                .path("/{id}").buildAndExpand(saved.getId()).toUri();
        return ResponseEntity.created(uri).body(saved);
   }

    @GetMapping("/{id}")
    public ResponseEntity<Exercicio> findById(@PathVariable Long id) {
        return ResponseEntity.ok(exercicioService.findById(id));
    }

    @GetMapping
    public ResponseEntity<List<Exercicio>> findAll() {
        return ResponseEntity.ok(exercicioService.findAll());
    }

    @PutMapping("/{id}")
    public ResponseEntity<Exercicio> updateExercicio(@PathVariable Long id, @RequestBody ExercicioRequest exercicioRequest) {
        Exercicio exercicio = criarExercicio(exercicioRequest);
        return ResponseEntity.ok(exercicioService.update(id, exercicio));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteExercicio(@PathVariable Long id) {
        exercicioService.delete(id);
        return ResponseEntity.noContent().build();
    }


    private Exercicio criarExercicio(ExercicioRequest produtoRequest) {

        Exercicio exercicio = new Exercicio();

        exercicio.setNome(produtoRequest.getNome());
        exercicio.setDescricao(produtoRequest.getDescricao());
        exercicio.setTipo(produtoRequest.getTipo());
       
        
        return exercicio;
    }

}
