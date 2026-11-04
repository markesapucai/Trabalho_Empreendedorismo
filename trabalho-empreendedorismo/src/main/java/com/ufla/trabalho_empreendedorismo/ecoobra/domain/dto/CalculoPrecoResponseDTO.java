package com.ufla.trabalho_empreendedorismo.ecoobra.domain.dto;

import com.ufla.trabalho_empreendedorismo.ecoobra.domain.FaixaPreco;
import java.math.BigDecimal;

public record CalculoPrecoResponseDTO(
        int quantidadeSacos,
        BigDecimal volumeEstimado,
        FaixaPreco faixaPreco,
        BigDecimal valorTotal,
        BigDecimal valorRepasse,
        BigDecimal taxaEcoObra
) {}
