package com.ufla.trabalho_empreendedorismo.ecoobra.repository;

import com.ufla.trabalho_empreendedorismo.ecoobra.domain.LocalDescarte;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.JpaSpecificationExecutor;
import org.springframework.data.repository.PagingAndSortingRepository;

import java.util.List;

public interface LocalDescarteRepository extends JpaRepository<LocalDescarte, Long>, JpaSpecificationExecutor<LocalDescarte>, PagingAndSortingRepository<LocalDescarte, Long> {
    List<LocalDescarte> findByAtivoTrue();
}
