package com.ufla.trabalho_empreendedorismo.ecoobra.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "perfis_freteiro")
@Getter
@Setter
public class PerfilFreteiro {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY) public Long id;
    @OneToOne(optional = false) @JoinColumn(unique = true) public Usuario usuario;
    @Column(nullable = false) public String tipoVeiculo, modeloVeiculo, placa;
    public boolean ativo = true;
}
