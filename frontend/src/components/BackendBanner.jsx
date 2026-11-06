import React, { useState, useEffect } from 'react';
import { checkBackendHealth } from '../services/api';

/**
 * Banner superior que monitora a conectividade com o backend Spring Boot na porta 8080.
 */
export default function BackendBanner() {
  const [status, setStatus] = useState({ checking: true, online: false, message: 'Verificando conexão...' });

  const verify = async () => {
    setStatus({ checking: true, online: false, message: 'Verificando conexão com o backend...' });
    const result = await checkBackendHealth();
    setStatus({ checking: false, online: result.online, message: result.message });
  };

  useEffect(() => {
    verify();
  }, []);

  return (
    <aside aria-label="Status do backend" className="backend-status-banner">
      <div className="status-indicator">
        <span
          className={`status-dot ${status.checking ? 'checking' : status.online ? 'online' : 'offline'}`}
          aria-hidden="true"
        ></span>
        <span>
          <strong>Backend API (Spring Boot):</strong>{' '}
          {status.checking ? 'Verificando...' : status.online ? 'Conectado (localhost:8080)' : 'Desconectado'}
        </span>
        <span style={{ color: 'var(--text-muted)', fontSize: '0.78rem' }}>
          ({status.message})
        </span>
      </div>
      <div>
        <button
          onClick={verify}
          className="btn btn-outline btn-sm"
          style={{ padding: '0.2rem 0.5rem', fontSize: '0.75rem' }}
          title="Checar conexão novamente"
        >
          🔄 Testar Conexão
        </button>
      </div>
    </aside>
  );
}
