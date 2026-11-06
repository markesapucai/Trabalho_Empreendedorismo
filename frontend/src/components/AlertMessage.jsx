import React from 'react';

/**
 * Componente para exibição de mensagens de alerta (sucesso, erro, info, aviso)
 */
export default function AlertMessage({ type = 'info', title, message, children, onClose }) {
  const typeClasses = {
    info: 'alert-info',
    success: 'alert-success',
    warning: 'alert-warning',
    error: 'alert-error'
  };

  const icons = {
    info: 'ℹ️',
    success: '✅',
    warning: '⚠️',
    error: '❌'
  };

  return (
    <div className={`alert ${typeClasses[type] || 'alert-info'}`} role="alert">
      <span style={{ fontSize: '1.2rem', lineHeight: 1 }}>{icons[type]}</span>
      <div style={{ flex: 1 }}>
        {title && <div style={{ fontWeight: 700, marginBottom: '0.2rem' }}>{title}</div>}
        {message && <div>{message}</div>}
        {children}
      </div>
      {onClose && (
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            fontSize: '1rem',
            opacity: 0.6,
            marginLeft: '0.5rem'
          }}
          title="Fechar"
        >
          ✕
        </button>
      )}
    </div>
  );
}
