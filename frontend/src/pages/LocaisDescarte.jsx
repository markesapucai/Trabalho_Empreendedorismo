import React, { useState, useEffect } from 'react';
import { localDescarteService } from '../services/localDescarteService';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Página de Locais de Descarte Autorizados
 * Integrada aos endpoints:
 * - GET /api/locais-descarte
 * - GET /api/locais-descarte/{id}
 */
export default function LocaisDescarte() {
  const [locais, setLocais] = useState([]);
  const [loading, setLoading] = useState(true);
  const [erro, setErro] = useState(null);
  const [filtro, setFiltro] = useState('');
  
  // Modal de Detalhes
  const [localSelecionado, setLocalSelecionado] = useState(null);

  // Carrega a lista de locais ativos
  const carregarLocais = async () => {
    setLoading(true);
    setErro(null);
    try {
      const data = await localDescarteService.listarAtivos();
      setLocais(Array.isArray(data) ? data : []);
    } catch (err) {
      setErro(err.message || 'Erro ao carregar locais de descarte da API.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    carregarLocais();
  }, []);

  // Busca detalhes do local por ID no endpoint GET /api/locais-descarte/{id}
  const abrirDetalhes = async (id) => {
    try {
      const data = await localDescarteService.buscarPorId(id);
      setLocalSelecionado(data);
    } catch (err) {
      alert(err.message || `Erro ao carregar local #${id}`);
    }
  };

  // Filtragem no cliente
  const locaisFiltrados = locais.filter((l) => {
    const termo = filtro.toLowerCase();
    return (
      (l.nome && l.nome.toLowerCase().includes(termo)) ||
      (l.bairro && l.bairro.toLowerCase().includes(termo)) ||
      (l.endereco && l.endereco.toLowerCase().includes(termo)) ||
      (l.cidade && l.cidade.toLowerCase().includes(termo))
    );
  });

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-primary">Endpoint: GET /api/locais-descarte</span>
            <span className="badge badge-neutral">Destinação Legal CONAMA 307</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Locais de Descarte Autorizados</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Ecopontos, áreas de triagem e aterros de resíduos da construção civil licenciados em Lavras-MG.
          </p>
        </div>
        <button
          onClick={carregarLocais}
          disabled={loading}
          className="btn btn-outline btn-sm"
        >
          🔄 Atualizar Lista
        </button>
      </div>

      {erro && (
        <AlertMessage
          type="error"
          title="Erro de comunicação com a API"
          message={erro}
          onClose={() => setErro(null)}
        />
      )}

      {/* Barra de Busca e Filtro */}
      <div className="card" style={{ padding: '1rem 1.25rem' }}>
        <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px' }}>
            <input
              type="text"
              placeholder="Buscar por nome, bairro ou endereço..."
              value={filtro}
              onChange={(e) => setFiltro(e.target.value)}
              className="form-input"
            />
          </div>
          <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)' }}>
            Exibindo <strong>{locaisFiltrados.length}</strong> de <strong>{locais.length}</strong> locais
          </div>
        </div>
      </div>

      {/* Estado de Carregamento */}
      {loading && <LoadingSpinner text="Carregando locais de descarte do banco de dados..." />}

      {/* Lista Vazia ou Sem Resultados */}
      {!loading && !erro && locaisFiltrados.length === 0 && (
        <div className="card" style={{ textAlign: 'center', padding: '3rem 1.5rem' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>🏛️</div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '0.5rem' }}>
            {locais.length === 0
              ? 'Nenhum local de descarte cadastrado na base'
              : 'Nenhum local encontrado para esta busca'}
          </h3>
          <p style={{ color: 'var(--text-muted)', maxWidth: '500px', margin: '0 auto 1.5rem auto', fontSize: '0.92rem' }}>
            {locais.length === 0
              ? 'A tabela locais_descarte do banco PostgreSQL está atualmente sem registros ativos. Assim que os ecopontos forem inseridos no banco, eles aparecerão aqui automaticamente.'
              : 'Tente alterar os termos da busca para encontrar o local desejado.'}
          </p>
          {locais.length > 0 && filtro && (
            <button onClick={() => setFiltro('')} className="btn btn-outline btn-sm">
              Limpar Filtro
            </button>
          )}
        </div>
      )}

      {/* Grid de Locais */}
      {!loading && locaisFiltrados.length > 0 && (
        <div className="grid-3">
          {locaisFiltrados.map((local) => (
            <div key={local.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem', marginBottom: '0.5rem' }}>
                  <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                    {local.nome}
                  </h3>
                  <span className="badge badge-primary">ID #{local.id}</span>
                </div>

                <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  📍 {local.endereco} — {local.bairro}, {local.cidade}
                </div>

                {local.descricao && (
                  <p style={{ fontSize: '0.88rem', color: 'var(--text-main)', background: 'var(--bg-subtle)', padding: '0.6rem', borderRadius: 'var(--radius-sm)', marginBottom: '1rem' }}>
                    {local.descricao}
                  </p>
                )}
              </div>

              <button
                onClick={() => abrirDetalhes(local.id)}
                className="btn btn-outline btn-sm"
                style={{ width: '100%', marginTop: '0.5rem' }}
              >
                🔍 Consultar Detalhes (via API /{local.id})
              </button>
            </div>
          ))}
        </div>
      )}

      {/* Modal / Card de Detalhes Individuais (GET /api/locais-descarte/{id}) */}
      {localSelecionado && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1rem'
        }}>
          <div className="card" style={{ maxWidth: '550px', width: '100%', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge badge-primary">GET /api/locais-descarte/{localSelecionado.id}</span>
              </div>
              <button
                onClick={() => setLocalSelecionado(null)}
                style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.25rem' }}
              >
                ✕
              </button>
            </div>

            <h2 style={{ fontSize: '1.4rem', fontWeight: 800, marginBottom: '0.5rem' }}>
              {localSelecionado.nome}
            </h2>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', margin: '1rem 0' }}>
              <div style={{ background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                <strong>Endereço Completo:</strong>
                <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                  {localSelecionado.endereco}, {localSelecionado.bairro} — {localSelecionado.cidade}
                </p>
              </div>

              {localSelecionado.descricao && (
                <div style={{ background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                  <strong>Regras e Resíduos Aceitos:</strong>
                  <p style={{ margin: 0, color: 'var(--text-muted)' }}>
                    {localSelecionado.descricao}
                  </p>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
              <button onClick={() => setLocalSelecionado(null)} className="btn btn-primary">
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
