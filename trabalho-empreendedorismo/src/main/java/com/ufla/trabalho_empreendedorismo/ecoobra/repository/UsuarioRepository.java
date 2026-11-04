package com.ufla.trabalho_empreendedorismo.ecoobra.repository;

import com.ufla.trabalho_empreendedorismo.ecoobra.domain.PerfilUsuario;
import com.ufla.trabalho_empreendedorismo.ecoobra.domain.Usuario;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;
import java.util.Optional;

public interface UsuarioRepository extends JpaRepository<Usuario, Long>, JpaSpecificationExecutor<Usuario>, PagingAndSortingRepository<Usuario, Long> {
    Optional<Usuario> findByEmail(String email);
    List<Usuario> findByPerfil(PerfilUsuario perfil);
}
