package com.ufla.trabalho_empreendedorismo.ecoobra.service;

import com.ufla.trabalho_empreendedorismo.ecoobra.domain.*;
import com.ufla.trabalho_empreendedorismo.ecoobra.repository.PedidoRepository;
import com.ufla.trabalho_empreendedorismo.ecoobra.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.UUID;

@Service
public class PedidoService {
    private final PedidoRepository pedidos;
    private final UsuarioRepository usuarios;
    private final PrecificacaoService precificacao;

    public PedidoService(PedidoRepository pedidos, UsuarioRepository usuarios, PrecificacaoService precificacao) {
        this.pedidos = pedidos;
        this.usuarios = usuarios;
        this.precificacao = precificacao;
    }

    @Transactional
    public Pedido criar(Long geradorId, Integer quantidade, String endereco, String bairro) {
        Usuario gerador = usuarios.findById(geradorId).orElseThrow(() -> new IllegalArgumentException("Gerador não encontrado"));
        if (gerador.perfil != PerfilUsuario.GERADOR) throw new IllegalArgumentException("Usuário não é gerador");
        var preco = precificacao.calcularPreco(quantidade);
        Pedido p = new Pedido();
        p.codigo = UUID.randomUUID().toString();
        p.gerador = gerador;
        p.quantidadeSacos = quantidade;
        p.volumeEstimado = preco.volumeEstimado();
        p.faixaPreco = preco.faixaPreco();
        p.valorTotal = preco.valorTotal();
        p.valorRepasse = preco.valorRepasse();
        p.taxaEcoObra = preco.taxaEcoObra();
        p.enderecoColeta = endereco;
        p.bairro = bairro;
        return pedidos.save(p);
    }

    public List<Pedido> pendentes() {
        return pedidos.findByStatusAndFreteiroIsNull(StatusPedido.PENDENTE);
    }

    @Transactional
    public Pedido aceitar(Long id, Long freteiroId) {
        Usuario freteiro = usuarios.findById(freteiroId).orElseThrow(() -> new IllegalArgumentException("Freteiro não encontrado"));

        if (freteiro.perfil != PerfilUsuario.FRETEIRO) throw new IllegalArgumentException("Usuário não é freteiro");
        Pedido pedido = pedidos.lockById(id).orElseThrow(() -> new IllegalArgumentException("Pedido não encontrado"));
        if (pedido.status != StatusPedido.PENDENTE || pedido.freteiro != null)
            throw new IllegalStateException("Pedido já foi aceito ou não está pendente");
        pedido.freteiro = freteiro;
        pedido.status = StatusPedido.ACEITO;
        pedido.dataAceite = java.time.Instant.now();
        return pedidos.save(pedido);
    }
}
