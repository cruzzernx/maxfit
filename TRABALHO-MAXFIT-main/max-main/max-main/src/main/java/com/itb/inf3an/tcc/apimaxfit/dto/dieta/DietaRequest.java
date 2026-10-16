package com.itb.inf3an.tcc.apimaxfit.dto.dieta;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class DietaRequest {

    private String nome;
    private String objetivo;
    private Integer calorias;
    private Integer proteina;
    private Integer carboidratos;
    private Integer gorduras;
    private Long personalId;
    private Long clienteId;
    private List<RefeicaoRequest> refeicoes;

}
