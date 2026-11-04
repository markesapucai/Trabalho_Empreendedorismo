package com.ufla.trabalho_empreendedorismo.ecoobra.api;

import com.ufla.trabalho_empreendedorismo.ecoobra.domain.dto.CalculoPrecoResponseDTO;
import com.ufla.trabalho_empreendedorismo.ecoobra.service.PrecificacaoService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

@RestController
@RequestMapping("/api/precificacao")
public class PrecificacaoController {
    private final PrecificacaoService precificacaoService;

    public PrecificacaoController(PrecificacaoService precificacaoService) {
        this.precificacaoService = precificacaoService;
    }

    @PostMapping("/calcular")
    public CalculoPrecoResponseDTO calcular(@Valid @RequestBody CalcularPrecoRequest request) {
        try {
            return precificacaoService.calcularPreco(request.quantidadeSacos());
        } catch (IllegalArgumentException exception) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, exception.getMessage(), exception);
        }
    }

    public record CalcularPrecoRequest(@NotNull Integer quantidadeSacos) {}
}
