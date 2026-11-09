package com.ufla.trabalho_empreendedorismo.ecoobra.service;

import com.ufla.trabalho_empreendedorismo.ecoobra.domain.*;
import com.ufla.trabalho_empreendedorismo.ecoobra.domain.dto.ComprovanteResponseDTO;
import com.ufla.trabalho_empreendedorismo.ecoobra.domain.dto.PedidoResponseDTO;
import com.ufla.trabalho_empreendedorismo.ecoobra.exception.RecursoNaoEncontradoException;
import com.ufla.trabalho_empreendedorismo.ecoobra.repository.LocalDescarteRepository;
import com.ufla.trabalho_empreendedorismo.ecoobra.repository.PedidoRepository;
import com.ufla.trabalho_empreendedorismo.ecoobra.repository.PerfilFreteiroRepository;
import com.ufla.trabalho_empreendedorismo.ecoobra.repository.UsuarioRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Comparator;
import java.util.List;
import java.util.UUID;

/**
 * Regras do fluxo principal do MVP:
 * gerador cria pedido → freteiro aceita → freteiro conclui com local de descarte e foto → comprovante.
 *
 * IllegalArgumentException = dado inválido (400); IllegalStateException = conflito de estado (409);
 * RecursoNaoEncontradoException = 404.
 */
@Service
public class PedidoService {
    private final PedidoRepository pedidos;
    private final UsuarioRepository usuarios;
    private final LocalDescarteRepository locais;
    private final PerfilFreteiroRepository perfisFreteiro;
    private final PrecificacaoService precificacao;

    public PedidoService(PedidoRepository pedidos, UsuarioRepository usuarios, LocalDescarteRepository locais,
                         PerfilFreteiroRepository perfisFreteiro, PrecificacaoService precificacao) {
        this.pedidos = pedidos;
        this.usuarios = usuarios;
        this.locais = locais;
        this.perfisFreteiro = perfisFreteiro;
        this.precificacao = precificacao;
    }

    @Transactional
    public PedidoResponseDTO criar(Long geradorId, Integer quantidade, String endereco, String bairro, String fotoEntulho) {
        Usuario gerador = buscarUsuario(geradorId, "Gerador");
        if (gerador.perfil != PerfilUsuario.GERADOR)
            throw new IllegalArgumentException("Apenas usuários com perfil GERADOR podem solicitar coleta");
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
        p.enderecoColeta = endereco.trim();
        p.bairro = bairro.trim();
        p.fotoEntulho = vazioParaNull(fotoEntulho);
        return PedidoResponseDTO.from(pedidos.save(p));
    }

    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> pendentes() {
        return pedidos.findByStatusAndFreteiroIsNull(StatusPedido.PENDENTE).stream()
                .sorted(Comparator.comparing((Pedido p) -> p.dataCriacao))
                .map(PedidoResponseDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public PedidoResponseDTO buscar(Long id) {
        return PedidoResponseDTO.from(buscarPedido(id));
    }

    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> doGerador(Long geradorId) {
        return pedidos.findByGeradorId(geradorId).stream()
                .sorted(Comparator.comparing((Pedido p) -> p.dataCriacao).reversed())
                .map(PedidoResponseDTO::from)
                .toList();
    }

    @Transactional(readOnly = true)
    public List<PedidoResponseDTO> doFreteiro(Long freteiroId) {
        return pedidos.findByFreteiroId(freteiroId).stream()
                .sorted(Comparator.comparing((Pedido p) -> p.dataCriacao).reversed())
                .map(PedidoResponseDTO::from)
                .toList();
    }

    @Transactional
    public PedidoResponseDTO aceitar(Long id, Long freteiroId) {
        Usuario freteiro = buscarUsuario(freteiroId, "Freteiro");
        if (freteiro.perfil != PerfilUsuario.FRETEIRO)
            throw new IllegalArgumentException("Apenas usuários com perfil FRETEIRO podem aceitar pedidos");
        // Lock pessimista: se dois freteiros clicarem ao mesmo tempo, só o primeiro leva.
        Pedido pedido = pedidos.lockById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Pedido não encontrado: " + id));
        if (pedido.status != StatusPedido.PENDENTE || pedido.freteiro != null)
            throw new IllegalStateException("Este pedido já foi aceito por outro freteiro");
        pedido.freteiro = freteiro;
        pedido.status = StatusPedido.ACEITO;
        pedido.dataAceite = Instant.now();
        return PedidoResponseDTO.from(pedidos.save(pedido));
    }

    @Transactional
    public PedidoResponseDTO concluir(Long id, Long freteiroId, Long localDescarteId, String fotoDescarga) {
        Pedido pedido = pedidos.lockById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Pedido não encontrado: " + id));
        if (pedido.status != StatusPedido.ACEITO)
            throw new IllegalStateException("Só é possível concluir pedidos com status ACEITO (atual: " + pedido.status + ")");
        if (pedido.freteiro == null || !pedido.freteiro.id.equals(freteiroId))
            throw new IllegalStateException("Este pedido foi aceito por outro freteiro");
        LocalDescarte local = locais.findById(localDescarteId)
                .orElseThrow(() -> new IllegalArgumentException("Local de descarte não encontrado: " + localDescarteId));
        if (!local.ativo)
            throw new IllegalArgumentException("Local de descarte inativo, escolha um local autorizado");
        if (vazioParaNull(fotoDescarga) == null)
            throw new IllegalArgumentException("A foto da descarga é obrigatória para emitir o comprovante");
        pedido.localDescarte = local;
        pedido.fotoDescarga = fotoDescarga;
        pedido.status = StatusPedido.CONCLUIDO;
        pedido.dataConclusao = Instant.now();
        return PedidoResponseDTO.from(pedidos.save(pedido));
    }

    @Transactional(readOnly = true)
    public ComprovanteResponseDTO comprovante(Long id) {
        Pedido p = buscarPedido(id);
        if (p.status != StatusPedido.CONCLUIDO)
            throw new IllegalStateException("O comprovante só é emitido após a conclusão da coleta (status atual: " + p.status + ")");
        String veiculo = perfisFreteiro.findByUsuarioId(p.freteiro.id)
                .map(v -> v.tipoVeiculo + " " + v.modeloVeiculo + " — Placa " + v.placa)
                .orElse(null);
        return new ComprovanteResponseDTO(
                p.id, p.codigo, p.gerador.nome, p.enderecoColeta, p.bairro, p.quantidadeSacos,
                p.volumeEstimado, p.faixaPreco, p.valorTotal, p.freteiro.nome, veiculo,
                PedidoResponseDTO.LocalResumo.from(p.localDescarte), p.fotoDescarga,
                p.dataCriacao, p.dataAceite, p.dataConclusao);
    }

    private Pedido buscarPedido(Long id) {
        return pedidos.findById(id).orElseThrow(() -> new RecursoNaoEncontradoException("Pedido não encontrado: " + id));
    }

    private Usuario buscarUsuario(Long id, String papel) {
        return usuarios.findById(id).orElseThrow(() -> new IllegalArgumentException(papel + " não encontrado: " + id));
    }

    private static String vazioParaNull(String s) {
        return s == null || s.isBlank() ? null : s;
    }
}
