package com.itb.inf3an.tcc.apimaxfit.dto.planoTreino;

import java.time.LocalDate;

import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class PlanoTreinoRequest {

      private String nome;
      private String grupoMuscular;
      private String nivel;
      private String descricao;
      private LocalDate dataInicio;
      private LocalDate dataFim;
      private String status;
      private Long personalId;
      private Long clienteId;


    
}