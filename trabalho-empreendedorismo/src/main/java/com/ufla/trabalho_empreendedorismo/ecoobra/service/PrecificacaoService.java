package com.ufla.trabalho_empreendedorismo.ecoobra.service;

import com.ufla.trabalho_empreendedorismo.ecoobra.domain.FaixaPreco;
import com.ufla.trabalho_empreendedorismo.ecoobra.domain.dto.CalculoPrecoResponseDTO;
import org.springframework.stereotype.Service;

import java.math.*;

@Service
public class PrecificacaoService {

    public BigDecimal calcularVolume(Integer n) {
        validar(n);
        return BigDecimal.valueOf(n).multiply(new BigDecimal("0.03")).setScale(2, RoundingMode.HALF_UP);
    }

    public FaixaPreco determinarFaixaPreco(Integer n) {
        validar(n);
        return n <= 10 ? FaixaPreco.P : n <= 25 ? FaixaPreco.M : FaixaPreco.G;
    }

    public BigDecimal calcularValorTotal(Integer n) {
        return switch (determinarFaixaPreco(n)) {
            case P -> new BigDecimal("70.00");
            case M -> new BigDecimal("110.00");
            case G -> new BigDecimal("170.00");
        };
    }

    public BigDecimal calcularValorRepasse(Integer n) {
        return calcularValorTotal(n).multiply(new BigDecimal("0.80"));
    }

    public BigDecimal calcularTaxaEcoObra(Integer n) {
        return calcularValorTotal(n).subtract(calcularValorRepasse(n));
    }

    public CalculoPrecoResponseDTO calcularPreco(Integer n) {
        return new CalculoPrecoResponseDTO(n, calcularVolume(n), determinarFaixaPreco(n), calcularValorTotal(n), calcularValorRepasse(n), calcularTaxaEcoObra(n));
    }

    private void validar(Integer n) {
        if (n == null || n < 1 || n > 50)
            throw new IllegalArgumentException("Quantidade deve estar entre 1 e 50 sacos");
    }
}
