import React from 'react';

/**
 * Componente visual de indicador de carregamento
 */
export default function LoadingSpinner({ text = 'Carregando dados da API...', inline = false }) {
  if (inline) {
    return (
      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '0.5rem' }}>
        <span className="spinner spinner-dark" style={{ width: '16px', height: '16px' }}></span>
        <span style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>{text}</span>
      </span>
    );
  }

  return (
    <div style={{
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      padding: '2.5rem 1rem',
      gap: '0.75rem'
    }}>
      <div className="spinner spinner-dark" style={{ width: '32px', height: '32px' }}></div>
      <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>{text}</p>
    </div>
  );
}
