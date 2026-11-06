import React, { useState, useEffect } from 'react';
import { checkBackendHealth } from '../services/api';
import { precificacaoService } from '../services/precificacaoService';
import { localDescarteService } from '../services/localDescarteService';

/**
 * Página de Diagnóstico e Status da Arquitetura
 * Permite testar todos os endpoints do backend em tempo real e visualizar o status do projeto.
 */
export default function StatusSistema() {
  const [health, setHealth] = useState({ checking: true, online: false, message: '' });
  const [testPreco, setTestPreco] = useState({ running: false, data: null, error: null });
  const [testLocais, setTestLocais] = useState({ running: false, data: null, error: null });

  const runAllTests = async () => {
    // 1. Health
    setHealth({ checking: true, online: false, message: 'Testando...' });
    const h = await checkBackendHealth();
    setHealth({ checking: false, online: h.online, message: h.message });

    // 2. Teste Precificacao
    setTestPreco({ running: true, data: null, error: null });
    try {
      const resPreco = await precificacaoService.calcularPreco(10);
      setTestPreco({ running: false, data: resPreco, error: null });
    } catch (err) {
      setTestPreco({ running: false, data: null, error: err.message });
    }

    // 3. Teste Locais
    setTestLocais({ running: true, data: null, error: null });
    try {
      const resLocais = await localDescarteService.listarAtivos();
      setTestLocais({ running: false, data: resLocais, error: null });
    } catch (err) {
      setTestLocais({ running: false, data: null, error: err.message });
    }
  };

  useEffect(() => {
    runAllTests();
  }, []);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-secondary">Painel de Diagnóstico</span>
            <span className="badge badge-neutral">Ambiente de Desenvolvimento</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Status do Sistema & API</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Monitoramento de integração entre o Frontend (React/Vite) e o Backend (Spring Boot na porta 8080).
          </p>
        </div>
        <button onClick={runAllTests} className="btn btn-primary btn-sm">
          🔄 Executar Todos os Testes de API
        </button>
      </div>

      {/* Cards de Status dos Endpoints */}
      <div className="grid-3">
        {/* Card 1: Conectividade Geral */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="badge badge-neutral">Servidor</span>
            <span className={`badge ${health.online ? 'badge-primary' : 'badge-danger'}`}>
              {health.checking ? 'Testando' : health.online ? 'Online' : 'Offline'}
            </span>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Backend Spring Boot</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            http://localhost:8080
          </p>
          <div style={{ fontSize: '0.85rem', background: 'var(--bg-subtle)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
            {health.message || 'Verificando conectividade...'}
          </div>
        </div>

        {/* Card 2: POST /api/precificacao/calcular */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="badge badge-neutral">POST</span>
            <span className={`badge ${testPreco.error ? 'badge-danger' : testPreco.data ? 'badge-primary' : 'badge-neutral'}`}>
              {testPreco.running ? 'Testando' : testPreco.error ? 'Erro' : 'OK 200'}
            </span>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>/api/precificacao/calcular</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            Teste com payload: {`{"quantidadeSacos": 10}`}
          </p>
          <div style={{ fontSize: '0.85rem', background: 'var(--bg-subtle)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
            {testPreco.running && 'Executando requisição...'}
            {testPreco.data && `Sucesso: Total R$ ${testPreco.data.valorTotal} (Faixa ${testPreco.data.faixaPreco})`}
            {testPreco.error && <span style={{ color: 'var(--danger)' }}>{testPreco.error}</span>}
          </div>
        </div>

        {/* Card 3: GET /api/locais-descarte */}
        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span className="badge badge-neutral">GET</span>
            <span className={`badge ${testLocais.error ? 'badge-danger' : testLocais.data ? 'badge-primary' : 'badge-neutral'}`}>
              {testLocais.running ? 'Testando' : testLocais.error ? 'Erro' : 'OK 200'}
            </span>
          </div>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>/api/locais-descarte</h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
            Lista de ecopontos autorizados e ativos
          </p>
          <div style={{ fontSize: '0.85rem', background: 'var(--bg-subtle)', padding: '0.5rem', borderRadius: 'var(--radius-sm)' }}>
            {testLocais.running && 'Executando requisição...'}
            {testLocais.data && `Sucesso: ${testLocais.data.length} locais retornados`}
            {testLocais.error && <span style={{ color: 'var(--danger)' }}>{testLocais.error}</span>}
          </div>
        </div>
      </div>

      {/* Matriz de Cobertura de Funcionalidades */}
      <div className="card">
        <h2 className="card-title">Matriz de Implementação e Cobertura da API</h2>
        <p className="card-subtitle">
          Relação de funcionalidades planejadas no MoSCoW, estado do backend e integração no frontend.
        </p>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.9rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Funcionalidade</th>
                <th style={{ padding: '0.75rem' }}>Endpoint HTTP</th>
                <th style={{ padding: '0.75rem' }}>Status no Backend</th>
                <th style={{ padding: '0.75rem' }}>Status no Frontend</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>Cálculo de Preço e Volume</td>
                <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>POST /api/precificacao/calcular</td>
                <td style={{ padding: '0.75rem' }}><span className="badge badge-primary">Implementado</span></td>
                <td style={{ padding: '0.75rem' }}><span className="badge badge-primary">Totalmente Integrado</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>Listagem de Locais de Descarte</td>
                <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>GET /api/locais-descarte</td>
                <td style={{ padding: '0.75rem' }}><span className="badge badge-primary">Implementado</span></td>
                <td style={{ padding: '0.75rem' }}><span className="badge badge-primary">Totalmente Integrado</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>Consulta de Local por ID</td>
                <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>GET /api/locais-descarte/{'{id}'}</td>
                <td style={{ padding: '0.75rem' }}><span className="badge badge-primary">Implementado</span></td>
                <td style={{ padding: '0.75rem' }}><span className="badge badge-primary">Totalmente Integrado</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>Criar Solicitação de Coleta</td>
                <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>POST /api/pedidos</td>
                <td style={{ padding: '0.75rem' }}><span className="badge badge-accent">Pendente (Entidade Criada)</span></td>
                <td style={{ padding: '0.75rem' }}><span className="badge badge-secondary">Interface Pronta (Prévia via API)</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>Painel do Freteiro (Listagem)</td>
                <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>GET /api/pedidos/pendentes</td>
                <td style={{ padding: '0.75rem' }}><span className="badge badge-accent">Pendente (Repo Criado)</span></td>
                <td style={{ padding: '0.75rem' }}><span className="badge badge-secondary">Interface Pronta (Wireframe 2)</span></td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>Aceite de Coleta pelo Freteiro</td>
                <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>POST /api/pedidos/{'{id}'}/aceitar</td>
                <td style={{ padding: '0.75rem' }}><span className="badge badge-accent">Pendente (lockById criado)</span></td>
                <td style={{ padding: '0.75rem' }}><span className="badge badge-secondary">Interface Pronta</span></td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem', fontWeight: 600 }}>Comprovante Selo EcoDescarte</td>
                <td style={{ padding: '0.75rem', fontFamily: 'monospace' }}>GET /api/pedidos/{'{id}'}/comprovante</td>
                <td style={{ padding: '0.75rem' }}><span className="badge badge-accent">Pendente</span></td>
                <td style={{ padding: '0.75rem' }}><span className="badge badge-primary">Pronto com Impressão/PDF</span></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
