import { apiRequest } from './api';

/**
 * Login simples do MVP (AuthController.java — /api/auth).
 * O backend não emite token: guardamos o usuário retornado no localStorage
 * e enviamos o id dele nas chamadas de pedidos.
 */
const STORAGE_KEY = 'ecoobra:usuario';

export const authService = {
  /** POST /api/auth/login  { email, senha } → { id, nome, email, telefone, perfil } */
  async login(email, senha) {
    const usuario = await apiRequest('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email, senha })
    });
    salvarSessao(usuario);
    return usuario;
  },

  /**
   * POST /api/auth/registro
   * { nome, email, senha, telefone, perfil: 'GERADOR'|'FRETEIRO', tipoVeiculo?, modeloVeiculo?, placa? }
   */
  async registrar(dados) {
    const usuario = await apiRequest('/api/auth/registro', {
      method: 'POST',
      body: JSON.stringify(dados)
    });
    salvarSessao(usuario);
    return usuario;
  },

  sair() {
    try { localStorage.removeItem(STORAGE_KEY); } catch { /* sem storage */ }
  },

  usuarioAtual() {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }
};

function salvarSessao(usuario) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(usuario)); } catch { /* sem storage */ }
}
