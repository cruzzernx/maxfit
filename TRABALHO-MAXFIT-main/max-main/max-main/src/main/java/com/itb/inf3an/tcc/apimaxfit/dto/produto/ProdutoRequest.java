package com.itb.inf3an.tcc.apimaxfit.dto.produto;

import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;

@Setter
@Getter
public class ProdutoRequest {

    private String nome;
    private String categoria;
    private BigDecimal preco;
    private Integer estoque;
    private String imagem;

}
