import React from 'react';

/**
 * Rodapé da aplicação
 */
export default function Footer({ onNavigate }) {
  return (
    <footer className="footer">
      <div className="footer-inner">
        <div>
          <strong>EcoObra</strong> — Gestão e Destinação Inteligente de Resíduos de Pequenas Obras
          <div style={{ fontSize: '0.8rem', color: 'var(--text-light)', marginTop: '0.2rem' }}>
            UFLA • Empreendedorismo • Lavras-MG
          </div>
        </div>
        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
          <button
            onClick={() => onNavigate('calculadora')}
            className="btn btn-outline btn-sm"
          >
            Simular Preço
          </button>
          <button
            onClick={() => onNavigate('locais')}
            className="btn btn-outline btn-sm"
          >
            Ver Ecopontos
          </button>
          <button
            onClick={() => onNavigate('status')}
            className="btn btn-outline btn-sm"
          >
            Status da API
          </button>
        </div>
      </div>
    </footer>
  );
}
