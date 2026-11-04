package com.ufla.trabalho_empreendedorismo.ecoobra.service;

import com.ufla.trabalho_empreendedorismo.ecoobra.domain.LocalDescarte;
import com.ufla.trabalho_empreendedorismo.ecoobra.exception.LocalDescarteNotFoundException;
import com.ufla.trabalho_empreendedorismo.ecoobra.repository.LocalDescarteRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional(readOnly = true)
public class LocalDescarteService {
    private final LocalDescarteRepository repository;

    public LocalDescarteService(LocalDescarteRepository repository) {
        this.repository = repository;
    }

    public List<LocalDescarte> listarLocaisAtivos() {
        return repository.findByAtivoTrue();
    }

    public LocalDescarte buscarLocalPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new LocalDescarteNotFoundException(id));
    }
}
