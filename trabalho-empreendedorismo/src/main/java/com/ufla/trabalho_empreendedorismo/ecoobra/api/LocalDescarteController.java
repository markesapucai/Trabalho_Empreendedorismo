package com.ufla.trabalho_empreendedorismo.ecoobra.api;

import com.ufla.trabalho_empreendedorismo.ecoobra.domain.LocalDescarte;
import com.ufla.trabalho_empreendedorismo.ecoobra.service.LocalDescarteService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/locais-descarte")
public class LocalDescarteController {
    private final LocalDescarteService localDescarteService;

    public LocalDescarteController(LocalDescarteService localDescarteService) {
        this.localDescarteService = localDescarteService;
    }

    @GetMapping
    public List<LocalDescarteResponse> listarAtivos() {
        return localDescarteService.listarLocaisAtivos().stream()
                .map(LocalDescarteResponse::from)
                .toList();
    }

    @GetMapping("/{id}")
    public LocalDescarteResponse buscarPorId(@PathVariable Long id) {
        return LocalDescarteResponse.from(localDescarteService.buscarLocalPorId(id));
    }

    public record LocalDescarteResponse(Long id, String nome, String descricao,
                                         String endereco, String bairro, String cidade) {
        static LocalDescarteResponse from(LocalDescarte local) {
            return new LocalDescarteResponse(local.getId(), local.getNome(), local.getDescricao(),
                    local.getEndereco(), local.getBairro(), local.getCidade());
        }
    }
}
