package com.ufla.trabalho_empreendedorismo.ecoobra.api;

import com.ufla.trabalho_empreendedorismo.ecoobra.domain.Pedido;
import com.ufla.trabalho_empreendedorismo.ecoobra.service.PedidoService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {
    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Pedido criar(@Valid @RequestBody CriarPedidoRequest r) {
        try {
            return service.criar(r.geradorId(), r.quantidadeSacos(), r.enderecoColeta(), r.bairro());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        }
    }

    @GetMapping("/pendentes")
    public List<Pedido> pendentes() {
        return service.pendentes();
    }

    @PostMapping("/{id}/aceitar")
    public Pedido aceitar(@PathVariable Long id, @Valid @RequestBody AceitarPedidoRequest r) {
        try {
            return service.aceitar(id, r.freteiroId());
        } catch (IllegalArgumentException e) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, e.getMessage(), e);
        } catch (IllegalStateException e) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, e.getMessage(), e);
        }
    }

    public record CriarPedidoRequest(@NotNull Long geradorId, @NotNull @Min(1) @Max(50) Integer quantidadeSacos,
                                     @NotBlank String enderecoColeta, @NotBlank String bairro) {
    }

    public record AceitarPedidoRequest(@NotNull Long freteiroId) {
    }
}
