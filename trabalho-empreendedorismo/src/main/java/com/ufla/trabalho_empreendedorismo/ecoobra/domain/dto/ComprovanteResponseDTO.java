package com.ufla.trabalho_empreendedorismo.ecoobra.domain.dto;

import com.ufla.trabalho_empreendedorismo.ecoobra.domain.FaixaPreco;

import java.math.BigDecimal;
import java.time.Instant;

/**
 * Dados do Comprovante Digital de Destinação (Selo EcoDescarte).
 * Só existe para pedidos com status CONCLUIDO.
 */
public record ComprovanteResponseDTO(
        Long pedidoId,
        String codigoAutenticidade,
        String geradorNome,
        String enderecoColeta,
        String bairro,
        Integer quantidadeSacos,
        BigDecimal volumeEstimado,
        FaixaPreco faixaPreco,
        BigDecimal valorTotal,
        String freteiroNome,
        String veiculo,
        PedidoResponseDTO.LocalResumo localDescarte,
        String fotoDescarga,
        Instant dataSolicitacao,
        Instant dataColeta,
        Instant dataConclusao
) {
}
