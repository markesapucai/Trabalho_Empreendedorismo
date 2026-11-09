package com.ufla.trabalho_empreendedorismo.ecoobra.api;

import com.ufla.trabalho_empreendedorismo.ecoobra.exception.LocalDescarteNotFoundException;
import com.ufla.trabalho_empreendedorismo.ecoobra.exception.RecursoNaoEncontradoException;
import org.springframework.http.HttpStatus;
import org.springframework.http.HttpStatusCode;
import org.springframework.http.ResponseEntity;
import org.springframework.http.converter.HttpMessageNotReadableException;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;

import java.time.Instant;
import java.util.LinkedHashMap;
import java.util.Map;
import java.util.stream.Collectors;

/**
 * Padroniza todas as respostas de erro da API no formato
 * {"status": 400, "erro": "Bad Request", "message": "...", "timestamp": "..."}
 * O frontend (services/api.js) lê o campo "message" para exibir ao usuário.
 */
@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> validacao(MethodArgumentNotValidException e) {
        String msg = e.getBindingResult().getFieldErrors().stream()
                .map(f -> f.getDefaultMessage() != null ? f.getDefaultMessage() : f.getField() + " inválido")
                .distinct()
                .collect(Collectors.joining("; "));
        return corpo(HttpStatus.BAD_REQUEST, msg.isBlank() ? "Dados inválidos" : msg);
    }

    @ExceptionHandler(HttpMessageNotReadableException.class)
    public ResponseEntity<Map<String, Object>> jsonInvalido(HttpMessageNotReadableException e) {
        return corpo(HttpStatus.BAD_REQUEST, "Corpo da requisição inválido ou mal formatado");
    }

    @ExceptionHandler(IllegalArgumentException.class)
    public ResponseEntity<Map<String, Object>> argumentoInvalido(IllegalArgumentException e) {
        return corpo(HttpStatus.BAD_REQUEST, e.getMessage());
    }

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<Map<String, Object>> conflito(IllegalStateException e) {
        return corpo(HttpStatus.CONFLICT, e.getMessage());
    }

    @ExceptionHandler({RecursoNaoEncontradoException.class, LocalDescarteNotFoundException.class})
    public ResponseEntity<Map<String, Object>> naoEncontrado(RuntimeException e) {
        return corpo(HttpStatus.NOT_FOUND, e.getMessage());
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<Map<String, Object>> responseStatus(ResponseStatusException e) {
        return corpo(e.getStatusCode(), e.getReason() != null ? e.getReason() : e.getMessage());
    }

    private ResponseEntity<Map<String, Object>> corpo(HttpStatusCode status, String message) {
        Map<String, Object> body = new LinkedHashMap<>();
        body.put("status", status.value());
        body.put("erro", status instanceof HttpStatus hs ? hs.getReasonPhrase() : String.valueOf(status.value()));
        body.put("message", message);
        body.put("timestamp", Instant.now().toString());
        return ResponseEntity.status(status).body(body);
    }
}
