package com.ufla.trabalho_empreendedorismo.ecoobra.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(HttpStatus.NOT_FOUND)
public class LocalDescarteNotFoundException extends RuntimeException {
    public LocalDescarteNotFoundException(Long id) {
        super("Local de descarte não encontrado: " + id);
    }
}
