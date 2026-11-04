package com.ufla.trabalho_empreendedorismo.ecoobra.domain;

import jakarta.persistence.*;

import java.time.Instant;
import lombok.Getter;
import lombok.Setter;

@Entity
@Table(name = "usuarios")
@Getter
@Setter
public class Usuario {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    public Long id;
    @Column(nullable = false)
    public String nome;
    @Column(nullable = false, unique = true)
    public String email;
    public String senha, telefone;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    public PerfilUsuario perfil;
    @Column(nullable = false)
    public Instant dataCadastro = Instant.now();
    @Column(nullable = false)
    public boolean ativo = true;
}
