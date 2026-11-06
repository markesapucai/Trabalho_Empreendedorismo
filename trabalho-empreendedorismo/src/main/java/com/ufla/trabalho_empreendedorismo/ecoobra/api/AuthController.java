package com.ufla.trabalho_empreendedorismo.ecoobra.api;

import com.ufla.trabalho_empreendedorismo.ecoobra.domain.*;
import com.ufla.trabalho_empreendedorismo.ecoobra.repository.UsuarioRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.security.*;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UsuarioRepository usuarios;

    public AuthController(UsuarioRepository usuarios) {
        this.usuarios = usuarios;
    }

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    public UsuarioView registrar(@Valid @RequestBody RegistroRequest r) {
        if (usuarios.findByEmail(r.email().trim().toLowerCase()).isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado");
        Usuario u = new Usuario();
        u.nome = r.nome().trim();
        u.email = r.email().trim().toLowerCase();
        u.perfil = r.perfil();
        u.senha = hash(r.senha());
        u.telefone = r.telefone();
        return view(usuarios.save(u));
    }

    @PostMapping("/login")
    public UsuarioView login(@Valid @RequestBody LoginRequest r) {
        Usuario u = usuarios.findByEmail(r.email().trim().toLowerCase()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas"));
        if (!u.ativo || !MessageDigest.isEqual(u.senha.getBytes(java.nio.charset.StandardCharsets.UTF_8), hash(r.senha()).getBytes(java.nio.charset.StandardCharsets.UTF_8)))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Credenciais inválidas");
        return view(u);
    }

    private UsuarioView view(Usuario u) {
        return new UsuarioView(u.id, u.nome, u.email, u.perfil);
    }

    private String hash(String password) {
        try {
            byte[] salt = "ecoobra-auth-v1".getBytes(java.nio.charset.StandardCharsets.UTF_8);
            PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, 120000, 256);
            return Base64.getEncoder().encodeToString(SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded());
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException(e);
        }
    }

    public record RegistroRequest(@NotBlank String nome, @Email @NotBlank String email, @Size(min = 8) String senha,
                                  String telefone, @NotNull PerfilUsuario perfil) {
    }

    public record LoginRequest(@Email @NotBlank String email, @NotBlank String senha) {
    }

    public record UsuarioView(Long id, String nome, String email, PerfilUsuario perfil) {
    }
}
