package com.ufla.trabalho_empreendedorismo.ecoobra.repository;

import com.ufla.trabalho_empreendedorismo.ecoobra.domain.PerfilFreteiro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.Optional;

public interface PerfilFreteiroRepository extends JpaRepository<PerfilFreteiro, Long>, JpaSpecificationExecutor<PerfilFreteiro>, PagingAndSortingRepository<PerfilFreteiro, Long> {
    Optional<PerfilFreteiro> findByUsuarioId(Long usuarioId);
}
