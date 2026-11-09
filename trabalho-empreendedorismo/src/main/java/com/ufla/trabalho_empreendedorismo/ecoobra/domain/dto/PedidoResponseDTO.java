package com.ufla.trabalho_empreendedorismo.ecoobra.domain.dto;

import com.ufla.trabalho_empreendedorismo.ecoobra.domain.FaixaPreco;
import com.ufla.trabalho_empreendedorismo.ecoobra.domain.LocalDescarte;
import com.ufla.trabalho_empreendedorismo.ecoobra.domain.Pedido;
import com.ufla.trabalho_empreendedorismo.ecoobra.domain.StatusPedido;
import com.ufla.trabalho_empreendedorismo.ecoobra.domain.Usuario;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Representação pública de um pedido. Nunca expõe a entidade Usuario
 * diretamente (evita vazar e-mail e hash de senha).
 */
public record PedidoResponseDTO(
        Long id,
        String codigo,
        StatusPedido status,
        Integer quantidadeSacos,
        BigDecimal volumeEstimado,
        FaixaPreco faixaPreco,
        BigDecimal valorTotal,
        BigDecimal valorRepasse,
        BigDecimal taxaEcoObra,
        String enderecoColeta,
        String bairro,
        String fotoEntulho,
        String fotoDescarga,
        UsuarioResumo gerador,
        UsuarioResumo freteiro,
        LocalResumo localDescarte,
        Instant dataCriacao,
        Instant dataAceite,
        Instant dataConclusao
) {
    public record UsuarioResumo(Long id, String nome, String telefone) {
        static UsuarioResumo from(Usuario u) {
            return u == null ? null : new UsuarioResumo(u.id, u.nome, u.telefone);
        }
    }

    public record LocalResumo(Long id, String nome, String endereco, String bairro, String cidade) {
        public static LocalResumo from(LocalDescarte l) {
            return l == null ? null : new LocalResumo(l.id, l.nome, l.endereco, l.bairro, l.cidade);
        }
    }

    public static PedidoResponseDTO from(Pedido p) {
        return new PedidoResponseDTO(
                p.id, p.codigo, p.status, p.quantidadeSacos, p.volumeEstimado, p.faixaPreco,
                p.valorTotal, p.valorRepasse, p.taxaEcoObra, p.enderecoColeta, p.bairro,
                p.fotoEntulho, p.fotoDescarga,
                UsuarioResumo.from(p.gerador), UsuarioResumo.from(p.freteiro),
                LocalResumo.from(p.localDescarte),
                p.dataCriacao, p.dataAceite, p.dataConclusao);
    }
}
