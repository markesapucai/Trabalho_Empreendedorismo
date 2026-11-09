import React from 'react';

/**
 * Bloqueio exibido quando a tela exige um usuário logado com determinado perfil.
 */
export default function ExigeLogin({ usuario, perfil, rotaAtual, onNavigate }) {
  const nomePerfil = perfil === 'FRETEIRO' ? 'freteiro' : 'morador (gerador)';
  const perfilErrado = usuario && usuario.perfil !== perfil;

  return (
    <div className="card" style={{ maxWidth: '520px', margin: '2rem auto', textAlign: 'center' }}>
      <div style={{ fontSize: '2.5rem' }}>{perfil === 'FRETEIRO' ? '🚚' : '🏠'}</div>
      <h2 className="card-title">
        {perfilErrado ? `Esta área é para ${nomePerfil}` : 'Entre para continuar'}
      </h2>
      <p className="card-subtitle">
        {perfilErrado
          ? `Você está logado como ${usuario.nome} (${usuario.perfil.toLowerCase()}). Saia e entre com uma conta de ${nomePerfil}.`
          : `Faça login com uma conta de ${nomePerfil} para usar esta tela.`}
      </p>
      {!perfilErrado && (
        <button className="btn btn-primary" onClick={() => onNavigate('entrar', rotaAtual)}>
          Entrar ou criar conta
        </button>
      )}
    </div>
  );
}
