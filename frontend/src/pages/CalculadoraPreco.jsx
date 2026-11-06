import React, { useState, useEffect, useCallback } from 'react';
import { precificacaoService } from '../services/precificacaoService';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Calculadora e Simulador de Preço
 * Integrada com o endpoint real: POST /api/precificacao/calcular
 */
export default function CalculadoraPreco({ onNavigate }) {
  const [sacos, setSacos] = useState(15);
  const [loading, setLoading] = useState(false);
  const [resultado, setResultado] = useState(null);
  const [erro, setErro] = useState(null);
  const [showTechnicalDetails, setShowTechnicalDetails] = useState(false);

  // Função para chamar o endpoint de cálculo
  const calcular = useCallback(async (qtd) => {
    const qtdNum = Number(qtd);

    if (isNaN(qtdNum) || qtdNum < 1 || qtdNum > 50) {
      if (qtdNum > 50) {
        setErro('Volumes acima de 50 sacos excedem o limite de coleta fracionada (1,5 m³). Recomendamos a contratação de caçamba estacionária tradicional.');
      } else {
        setErro('A quantidade de sacos deve estar entre 1 e 50 sacos.');
      }
      setResultado(null);
      return;
    }

    setLoading(true);
    setErro(null);

    try {
      const data = await precificacaoService.calcularPreco(qtdNum);
      setResultado(data);
    } catch (err) {
      setErro(err.message || 'Erro ao processar cálculo na API.');
      setResultado(null);
    } finally {
      setLoading(false);
    }
  }, []);

  // Calcula automaticamente na montagem da tela com 15 sacos
  useEffect(() => {
    calcular(15);
  }, [calcular]);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSacos(val);
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    calcular(sacos);
  };

  const handleShortcutClick = (qtd) => {
    setSacos(qtd);
    calcular(qtd);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Cabeçalho da Página */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span className="badge badge-primary">Endpoint: POST /api/precificacao/calcular</span>
          <span className="badge badge-neutral">Regra Oficial EcoObra</span>
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Simulador de Preço e Volume</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Calcule instantaneamente o volume em metros cúbicos ($0,03\text{ m}^3$ por saco) e o preço tabelado da coleta residencial em Lavras.
        </p>
      </div>

      {erro && (
        <AlertMessage
          type="error"
          title="Não foi possível calcular o preço"
          message={erro}
          onClose={() => setErro(null)}
        />
      )}

      {/* Grid de Entrada e Resultado */}
      <div className="grid-2">
        {/* Formulário de Simulação */}
        <div className="card">
          <h2 className="card-title">1. Informe a Quantidade de Sacos</h2>
          <p className="card-subtitle">
            Considere sacos de ráfia padrão de entulho (capacidade aprox. de 0,03 m³ cada).
          </p>

          <form onSubmit={handleFormSubmit}>
            <div className="form-group">
              <label htmlFor="sacosInput" className="form-label">
                Número de Sacos (1 a 50)
              </label>
              <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <input
                  id="sacosInput"
                  type="number"
                  min="1"
                  max="50"
                  value={sacos}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ fontSize: '1.25rem', fontWeight: 700, maxWidth: '120px' }}
                />
                <button
                  type="submit"
                  disabled={loading}
                  className="btn btn-primary"
                  style={{ flex: 1 }}
                >
                  {loading ? 'Calculando...' : 'Atualizar Cálculo'}
                </button>
              </div>
              <span className="form-hint">
                Selecione entre 1 e 50 sacos de entulho ensacado.
              </span>
            </div>

            {/* Slider interativo */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Ajuste fino no controle deslizante:
              </label>
              <input
                type="range"
                min="1"
                max="50"
                value={Number(sacos) || 1}
                onChange={(e) => {
                  setSacos(e.target.value);
                  calcular(e.target.value);
                }}
                style={{ width: '100%', accentColor: 'var(--primary)', cursor: 'pointer' }}
              />
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-light)' }}>
                <span>1 saco (mín.)</span>
                <span>25 sacos (M)</span>
                <span>50 sacos (máx.)</span>
              </div>
            </div>

            {/* Atalhos rápidos */}
            <div className="form-group">
              <label className="form-label" style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                Quantidades frequentes em reformas:
              </label>
              <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                {[5, 10, 15, 20, 25, 30, 45, 50].map((qtd) => (
                  <button
                    key={qtd}
                    type="button"
                    onClick={() => handleShortcutClick(qtd)}
                    className={`btn btn-sm ${Number(sacos) === qtd ? 'btn-primary' : 'btn-outline'}`}
                  >
                    {qtd} sacos
                  </button>
                ))}
              </div>
            </div>
          </form>
        </div>

        {/* Resultado Retornado pela API */}
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
              <h2 className="card-title" style={{ margin: 0 }}>2. Resultado do Cálculo</h2>
              {resultado && (
                <span className={`badge ${resultado.faixaPreco === 'P' ? 'badge-primary' : resultado.faixaPreco === 'M' ? 'badge-secondary' : 'badge-accent'}`}>
                  Faixa {resultado.faixaPreco}
                </span>
              )}
            </div>
            <p className="card-subtitle">
              Valores processados diretamente pela regra de negócio do backend Spring Boot.
            </p>

            {loading && <LoadingSpinner text="Consultando API de precificação..." />}

            {!loading && resultado && (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                {/* Destaque do Preço */}
                <div style={{
                  backgroundColor: 'var(--primary-light)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  border: '1px solid #a7f3d0',
                  textAlign: 'center'
                }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', fontWeight: 600, textTransform: 'uppercase' }}>
                    Preço Fixo ao Gerador (Morador)
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 800, color: 'var(--primary-dark)', lineHeight: 1.2 }}>
                    R$ {Number(resultado.valorTotal).toFixed(2).replace('.', ',')}
                  </div>
                  <div style={{ fontSize: '0.8rem', color: 'var(--primary-dark)', opacity: 0.85 }}>
                    Sem taxa de caçamba vazia • Coleta em até 24 horas
                  </div>
                </div>

                {/* Métricas detalhadas */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
                  <div style={{ background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Volume Estimado</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                      {resultado.volumeEstimado} m³
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Faixa de Resíduos</div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700 }}>
                      Faixa {resultado.faixaPreco}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Repasse ao Freteiro (80%)</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--primary-dark)' }}>
                      R$ {Number(resultado.valorRepasse).toFixed(2).replace('.', ',')}
                    </div>
                  </div>

                  <div style={{ background: 'var(--bg-subtle)', padding: '0.75rem', borderRadius: 'var(--radius-md)' }}>
                    <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Taxa EcoObra (20%)</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 700, color: 'var(--text-muted)' }}>
                      R$ {Number(resultado.taxaEcoObra).toFixed(2).replace('.', ',')}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {!loading && !resultado && !erro && (
              <div style={{ textAlign: 'center', padding: '2rem 1rem', color: 'var(--text-muted)' }}>
                Informe a quantidade de sacos ao lado para calcular.
              </div>
            )}
          </div>

          {/* Ações posteriores */}
          {resultado && (
            <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
              <button
                onClick={() => onNavigate('solicitar')}
                className="btn btn-primary"
                style={{ flex: 1 }}
              >
                Avançar para Solicitação com este Valor
              </button>
              <button
                type="button"
                onClick={() => setShowTechnicalDetails(!showTechnicalDetails)}
                className="btn btn-outline btn-sm"
              >
                {showTechnicalDetails ? 'Ocultar JSON' : 'Ver JSON da API'}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Painel de Depuração Técnica do Endpoint */}
      {showTechnicalDetails && resultado && (
        <div className="card" style={{ background: '#1e293b', color: '#e2e8f0' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <span style={{ fontFamily: 'monospace', fontSize: '0.85rem', color: '#38bdf8' }}>
              Contrato DTO (com.ufla.trabalho_empreendedorismo.ecoobra.domain.dto.CalculoPrecoResponseDTO)
            </span>
            <span className="badge badge-neutral" style={{ background: '#334155', color: '#94a3b8' }}>JSON</span>
          </div>
          <pre style={{ margin: 0, padding: '1rem', background: '#0f172a', borderRadius: 'var(--radius-sm)', overflowX: 'auto', fontSize: '0.85rem' }}>
            {JSON.stringify(resultado, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}
