package com.itb.inf3an.tcc.apimaxfit.dto.dieta;

import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Setter
@Getter
public class RefeicaoRequest {

    private String horario;
    private String nome;
    private List<String> alimentos;
    private Integer calorias;
    private Integer proteina;
    private Integer carboidratos;
    private Integer gorduras;

}
