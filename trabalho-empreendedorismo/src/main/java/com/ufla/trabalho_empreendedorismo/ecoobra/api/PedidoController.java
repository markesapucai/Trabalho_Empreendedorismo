package com.ufla.trabalho_empreendedorismo.ecoobra.api;

import com.ufla.trabalho_empreendedorismo.ecoobra.domain.dto.ComprovanteResponseDTO;
import com.ufla.trabalho_empreendedorismo.ecoobra.domain.dto.PedidoResponseDTO;
import com.ufla.trabalho_empreendedorismo.ecoobra.service.PedidoService;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * Erros de regra de negócio (400/404/409) são convertidos em JSON {status, message}
 * pelo ApiExceptionHandler.
 */
@RestController
@RequestMapping("/api/pedidos")
public class PedidoController {
    private final PedidoService service;

    public PedidoController(PedidoService service) {
        this.service = service;
    }

    /** Gerador cria a solicitação de coleta. */
    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public PedidoResponseDTO criar(@Valid @RequestBody CriarPedidoRequest r) {
        return service.criar(r.geradorId(), r.quantidadeSacos(), r.enderecoColeta(), r.bairro(), r.fotoEntulho());
    }

    /** Pedidos abertos para o painel do freteiro. */
    @GetMapping("/pendentes")
    public List<PedidoResponseDTO> pendentes() {
        return service.pendentes();
    }

    /** Pedidos de um gerador ("Meus pedidos"). */
    @GetMapping("/gerador/{geradorId}")
    public List<PedidoResponseDTO> doGerador(@PathVariable Long geradorId) {
        return service.doGerador(geradorId);
    }

    /** Pedidos aceitos/concluídos por um freteiro ("Minhas coletas"). */
    @GetMapping("/freteiro/{freteiroId}")
    public List<PedidoResponseDTO> doFreteiro(@PathVariable Long freteiroId) {
        return service.doFreteiro(freteiroId);
    }

    @GetMapping("/{id}")
    public PedidoResponseDTO buscar(@PathVariable Long id) {
        return service.buscar(id);
    }

    /** Freteiro aceita um pedido pendente (com lock para evitar aceite duplo). */
    @PostMapping("/{id}/aceitar")
    public PedidoResponseDTO aceitar(@PathVariable Long id, @Valid @RequestBody AceitarPedidoRequest r) {
        return service.aceitar(id, r.freteiroId());
    }

    /** Freteiro encerra a coleta informando o local autorizado e a foto da descarga. */
    @PostMapping("/{id}/concluir")
    public PedidoResponseDTO concluir(@PathVariable Long id, @Valid @RequestBody ConcluirPedidoRequest r) {
        return service.concluir(id, r.freteiroId(), r.localDescarteId(), r.fotoDescarga());
    }

    /** Comprovante Digital de Destinação (Selo EcoDescarte). 409 se o pedido ainda não foi concluído. */
    @GetMapping("/{id}/comprovante")
    public ComprovanteResponseDTO comprovante(@PathVariable Long id) {
        return service.comprovante(id);
    }

    public record CriarPedidoRequest(
            @NotNull(message = "geradorId é obrigatório") Long geradorId,
            @NotNull(message = "Informe a quantidade de sacos")
            @Min(value = 1, message = "A quantidade mínima é 1 saco")
            @Max(value = 50, message = "Acima de 50 sacos, recomendamos contratar uma caçamba")
            Integer quantidadeSacos,
            @NotBlank(message = "O endereço de coleta é obrigatório") String enderecoColeta,
            @NotBlank(message = "O bairro é obrigatório") String bairro,
            @NotBlank(message = "A foto do entulho é obrigatória") String fotoEntulho) {
    }

    public record AceitarPedidoRequest(@NotNull(message = "freteiroId é obrigatório") Long freteiroId) {
    }

    public record ConcluirPedidoRequest(
            @NotNull(message = "freteiroId é obrigatório") Long freteiroId,
            @NotNull(message = "Selecione o local de descarte") Long localDescarteId,
            @NotBlank(message = "A foto da descarga é obrigatória") String fotoDescarga) {
    }
}
