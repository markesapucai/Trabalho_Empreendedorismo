package com.ufla.trabalho_empreendedorismo.ecoobra.api;

import com.ufla.trabalho_empreendedorismo.ecoobra.domain.*;
import com.ufla.trabalho_empreendedorismo.ecoobra.repository.PerfilFreteiroRepository;
import com.ufla.trabalho_empreendedorismo.ecoobra.repository.UsuarioRepository;
import jakarta.validation.Valid;
import jakarta.validation.constraints.*;
import org.springframework.http.HttpStatus;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;

import java.nio.charset.StandardCharsets;
import java.security.*;
import java.util.Base64;
import javax.crypto.SecretKeyFactory;
import javax.crypto.spec.PBEKeySpec;

/**
 * Login simples do MVP (sem token): o front guarda o usuário retornado e envia o id nas chamadas.
 */
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    private final UsuarioRepository usuarios;
    private final PerfilFreteiroRepository perfisFreteiro;

    public AuthController(UsuarioRepository usuarios, PerfilFreteiroRepository perfisFreteiro) {
        this.usuarios = usuarios;
        this.perfisFreteiro = perfisFreteiro;
    }

    @PostMapping("/registro")
    @ResponseStatus(HttpStatus.CREATED)
    @Transactional
    public UsuarioView registrar(@Valid @RequestBody RegistroRequest r) {
        if (usuarios.findByEmail(r.email().trim().toLowerCase()).isPresent())
            throw new ResponseStatusException(HttpStatus.CONFLICT, "E-mail já cadastrado");
        Usuario u = new Usuario();
        u.nome = r.nome().trim();
        u.email = r.email().trim().toLowerCase();
        u.perfil = r.perfil();
        u.senha = hash(r.senha());
        u.telefone = r.telefone();
        u = usuarios.save(u);

        if (r.perfil() == PerfilUsuario.FRETEIRO) {
            if (isBlank(r.tipoVeiculo()) || isBlank(r.modeloVeiculo()) || isBlank(r.placa()))
                throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "Freteiro precisa informar tipo, modelo e placa do veículo");
            PerfilFreteiro pf = new PerfilFreteiro();
            pf.usuario = u;
            pf.tipoVeiculo = r.tipoVeiculo().trim();
            pf.modeloVeiculo = r.modeloVeiculo().trim();
            pf.placa = r.placa().trim().toUpperCase();
            perfisFreteiro.save(pf);
        }
        return view(u);
    }

    @PostMapping("/login")
    public UsuarioView login(@Valid @RequestBody LoginRequest r) {
        Usuario u = usuarios.findByEmail(r.email().trim().toLowerCase()).orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha incorretos"));
        if (!u.ativo || u.senha == null || !MessageDigest.isEqual(u.senha.getBytes(StandardCharsets.UTF_8), hash(r.senha()).getBytes(StandardCharsets.UTF_8)))
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "E-mail ou senha incorretos");
        return view(u);
    }

    private UsuarioView view(Usuario u) {
        return new UsuarioView(u.id, u.nome, u.email, u.telefone, u.perfil);
    }

    private static boolean isBlank(String s) {
        return s == null || s.isBlank();
    }

    private String hash(String password) {
        try {
            byte[] salt = "ecoobra-auth-v1".getBytes(StandardCharsets.UTF_8);
            PBEKeySpec spec = new PBEKeySpec(password.toCharArray(), salt, 120000, 256);
            return Base64.getEncoder().encodeToString(SecretKeyFactory.getInstance("PBKDF2WithHmacSHA256").generateSecret(spec).getEncoded());
        } catch (GeneralSecurityException e) {
            throw new IllegalStateException(e);
        }
    }

    public record RegistroRequest(@NotBlank(message = "Informe o nome") String nome,
                                  @Email(message = "E-mail inválido") @NotBlank(message = "Informe o e-mail") String email,
                                  @NotNull(message = "Informe a senha") @Size(min = 8, message = "A senha deve ter pelo menos 8 caracteres") String senha,
                                  String telefone,
                                  @NotNull(message = "Escolha o perfil (GERADOR ou FRETEIRO)") PerfilUsuario perfil,
                                  String tipoVeiculo, String modeloVeiculo, String placa) {
    }

    public record LoginRequest(@Email(message = "E-mail inválido") @NotBlank(message = "Informe o e-mail") String email,
                               @NotBlank(message = "Informe a senha") String senha) {
    }

    public record UsuarioView(Long id, String nome, String email, String telefone, PerfilUsuario perfil) {
    }
}
