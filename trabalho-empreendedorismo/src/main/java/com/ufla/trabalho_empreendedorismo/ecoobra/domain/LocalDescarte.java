package com.ufla.trabalho_empreendedorismo.ecoobra.domain;

import jakarta.persistence.*;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "locais_descarte")
@Getter
@Setter
public class LocalDescarte {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    @Column(nullable = false)
    public String nome, endereco, bairro, cidade;
    @Column(length = 2000)
    public String descricao;
    public boolean ativo = true;
}
