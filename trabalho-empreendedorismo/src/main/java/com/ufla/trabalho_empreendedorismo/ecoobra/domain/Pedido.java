package com.ufla.trabalho_empreendedorismo.ecoobra.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

import java.math.BigDecimal;
import java.time.Instant;

@Entity
@Table(name = "pedidos")
@Getter
@Setter
public class Pedido {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    @Column(nullable = false, unique = true)
    public String codigo;
    @ManyToOne(optional = false)
    public Usuario gerador;
    @ManyToOne
    public Usuario freteiro;
    @Column(nullable = false)
    public Integer quantidadeSacos;
    @Column(nullable = false, precision = 7, scale = 2)
    public BigDecimal volumeEstimado;
    @Enumerated(EnumType.STRING)
    public FaixaPreco faixaPreco;
    @Column(nullable = false, precision = 10, scale = 2)
    public BigDecimal valorTotal, valorRepasse, taxaEcoObra;
    @Column(nullable = false)
    public String enderecoColeta, bairro;
    // Fotos são enviadas como data URL (base64) pelo front; TEXT porque não cabem em VARCHAR(2000).
    @Column(columnDefinition = "TEXT")
    public String fotoEntulho;
    @Column(columnDefinition = "TEXT")
    public String fotoDescarga;
    @ManyToOne
    public LocalDescarte localDescarte;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public StatusPedido status = StatusPedido.PENDENTE;
    public Instant dataCriacao = Instant.now(), dataAceite, dataConclusao;
}
