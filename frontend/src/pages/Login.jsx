import React, { useState } from 'react';
import { authService } from '../services/authService';
import AlertMessage from '../components/AlertMessage';

/**
 * Login e cadastro de gerador (morador) e freteiro.
 * Integra com POST /api/auth/login e POST /api/auth/registro.
 */
export default function Login({ onLogin }) {
  const [modo, setModo] = useState('login'); // 'login' | 'cadastro'
  const [form, setForm] = useState({
    nome: '', email: '', senha: '', telefone: '', perfil: 'GERADOR',
    tipoVeiculo: 'Picape', modeloVeiculo: '', placa: ''
  });
  const [erro, setErro] = useState(null);
  const [enviando, setEnviando] = useState(false);

  const set = (e) => setForm((f) => ({ ...f, [e.target.name]: e.target.value }));

  const entrar = async (email, senha) => {
    setErro(null);
    setEnviando(true);
    try {
      onLogin(await authService.login(email, senha));
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (modo === 'login') return entrar(form.email, form.senha);

    setErro(null);
    setEnviando(true);
    try {
      const dados = {
        nome: form.nome, email: form.email, senha: form.senha,
        telefone: form.telefone, perfil: form.perfil
      };
      if (form.perfil === 'FRETEIRO') {
        Object.assign(dados, { tipoVeiculo: form.tipoVeiculo, modeloVeiculo: form.modeloVeiculo, placa: form.placa });
      }
      onLogin(await authService.registrar(dados));
    } catch (err) {
      setErro(err.message);
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ maxWidth: '480px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
      <div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>{modo === 'login' ? 'Entrar no EcoObra' : 'Criar conta'}</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Moradores solicitam coletas; freteiros aceitam e concluem as corridas.
        </p>
      </div>

      {erro && <AlertMessage type="error" message={erro} onClose={() => setErro(null)} />}

      <form onSubmit={handleSubmit} className="card">
        {modo === 'cadastro' && (
          <>
            <div className="form-group">
              <label className="form-label">Eu sou</label>
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                {[['GERADOR', '🏠 Morador / comerciante'], ['FRETEIRO', '🚚 Freteiro']].map(([valor, texto]) => (
                  <button
                    key={valor}
                    type="button"
                    onClick={() => setForm((f) => ({ ...f, perfil: valor }))}
                    className={`btn ${form.perfil === valor ? 'btn-primary' : 'btn-outline'}`}
                    style={{ flex: 1 }}
                  >
                    {texto}
                  </button>
                ))}
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="nome" className="form-label">Nome *</label>
              <input id="nome" name="nome" required value={form.nome} onChange={set} className="form-input" />
            </div>
            <div className="form-group">
              <label htmlFor="telefone" className="form-label">Telefone / WhatsApp</label>
              <input id="telefone" name="telefone" value={form.telefone} onChange={set} className="form-input" placeholder="(35) 9...." />
            </div>
          </>
        )}

        <div className="form-group">
          <label htmlFor="email" className="form-label">E-mail *</label>
          <input id="email" name="email" type="email" required value={form.email} onChange={set} className="form-input" autoComplete="email" />
        </div>
        <div className="form-group">
          <label htmlFor="senha" className="form-label">Senha *</label>
          <input id="senha" name="senha" type="password" required minLength={modo === 'cadastro' ? 8 : undefined}
            value={form.senha} onChange={set} className="form-input"
            autoComplete={modo === 'login' ? 'current-password' : 'new-password'} />
          {modo === 'cadastro' && <span className="form-hint">Mínimo de 8 caracteres.</span>}
        </div>

        {modo === 'cadastro' && form.perfil === 'FRETEIRO' && (
          <>
            <div className="form-group">
              <label htmlFor="tipoVeiculo" className="form-label">Tipo de veículo *</label>
              <select id="tipoVeiculo" name="tipoVeiculo" value={form.tipoVeiculo} onChange={set} className="form-select">
                <option>Picape</option>
                <option>Utilitário</option>
                <option>Caminhão 3/4</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="modeloVeiculo" className="form-label">Modelo *</label>
              <input id="modeloVeiculo" name="modeloVeiculo" required value={form.modeloVeiculo} onChange={set} className="form-input" placeholder="Ex.: Fiat Strada" />
            </div>
            <div className="form-group">
              <label htmlFor="placa" className="form-label">Placa *</label>
              <input id="placa" name="placa" required value={form.placa} onChange={set} className="form-input" placeholder="ABC1D23" />
            </div>
          </>
        )}

        <button type="submit" className="btn btn-primary" style={{ width: '100%' }} disabled={enviando}>
          {enviando ? 'Aguarde...' : modo === 'login' ? 'Entrar' : 'Criar conta'}
        </button>

        <button
          type="button"
          className="btn btn-outline"
          style={{ width: '100%', marginTop: '0.75rem' }}
          onClick={() => { setModo(modo === 'login' ? 'cadastro' : 'login'); setErro(null); }}
        >
          {modo === 'login' ? 'Não tenho conta — cadastrar' : 'Já tenho conta — entrar'}
        </button>
      </form>

      {modo === 'login' && (
        <div className="card" style={{ background: 'var(--bg-subtle)' }}>
          <h2 className="card-title" style={{ fontSize: '1rem' }}>Contas de teste (demonstração)</h2>
          <p className="card-subtitle">Senha das duas: <code>ecoobra123</code></p>
          <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
            <button type="button" className="btn btn-secondary btn-sm" disabled={enviando}
              onClick={() => entrar('morador@ecoobra.com', 'ecoobra123')}>
              🏠 Entrar como Morador
            </button>
            <button type="button" className="btn btn-secondary btn-sm" disabled={enviando}
              onClick={() => entrar('freteiro@ecoobra.com', 'ecoobra123')}>
              🚚 Entrar como Freteiro
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
