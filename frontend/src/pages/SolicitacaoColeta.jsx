import React, { useState, useEffect } from 'react';
import { precificacaoService } from '../services/precificacaoService';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';

/**
 * Tela 1 – Solicitação de Coleta (Visão Gerador / Morador)
 * Integração com POST /api/precificacao/calcular para orçamento prévio em tempo real
 */
export default function SolicitacaoColeta({ onNavigate }) {
  const [formData, setFormData] = useState({
    nome: '',
    telefone: '',
    endereco: '',
    bairro: 'Centro',
    quantidadeSacos: 15,
    observacoes: ''
  });

  const [fotoPreview, setFotoPreview] = useState(null);
  const [calculo, setCalculo] = useState(null);
  const [loadingCalculo, setLoadingCalculo] = useState(false);
  const [erroCalculo, setErroCalculo] = useState(null);
  const [submetido, setSubmetido] = useState(false);

  // Lista de bairros populares de Lavras
  const bairrosLavras = [
    'Centro',
    'Centenário',
    'Jardim Glória',
    'Água Limpa',
    'Vila São Francisco',
    'Nova Lavras',
    'Belvedere',
    'Vila Murad',
    'Olavo Costa',
    'Outro'
  ];

  // Atualiza cálculo sempre que a quantidade de sacos mudar
  useEffect(() => {
    let cancel = false;
    const qtd = Number(formData.quantidadeSacos);
    if (qtd >= 1 && qtd <= 50) {
      setLoadingCalculo(true);
      setErroCalculo(null);
      precificacaoService.calcularPreco(qtd)
        .then((data) => {
          if (!cancel) setCalculo(data);
        })
        .catch((err) => {
          if (!cancel) setErroCalculo(err.message);
        })
        .finally(() => {
          if (!cancel) setLoadingCalculo(false);
        });
    } else {
      setCalculo(null);
    }
    return () => { cancel = true; };
  }, [formData.quantidadeSacos]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFotoPreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.endereco || !formData.bairro) {
      alert('Por favor, informe o endereço e o bairro da coleta.');
      return;
    }
    setSubmetido(true);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Cabeçalho */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <span className="badge badge-primary">Wireframe 1 • Entrega 3</span>
          <span className="badge badge-neutral">Visão do Gerador</span>
        </div>
        <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Solicitar Coleta de Entulho</h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
          Envie a foto dos sacos na calçada, informe o endereço e receba a coleta em até 24 horas com preço fixo.
        </p>
      </div>

      {submetido ? (
        /* Painel Informativo sobre Status do Backend */
        <div className="card" style={{ border: '2px solid var(--secondary)', background: '#f0f9ff' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <span style={{ fontSize: '2rem' }}>📋</span>
            <div>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: '#0369a1', margin: 0 }}>
                Solicitação Validada pelo Frontend
              </h2>
              <span className="badge badge-secondary">Status da Arquitetura: Aguardando PedidoController</span>
            </div>
          </div>

          <AlertMessage
            type="info"
            title="Sinalização de Limitação Atual do Backend"
            message="O formulário validou os dados e realizou o cálculo oficial de valores consumindo a API real (/api/precificacao/calcular). No entanto, conforme diagnosticado na análise inicial do projeto, o endpoint para gravação de novos pedidos (POST /api/pedidos) ainda não foi implementado no backend Spring Boot."
          />

          <div style={{ background: 'white', padding: '1.25rem', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)', marginBottom: '1.25rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '0.75rem' }}>
              Dados Consolidados da Solicitação:
            </h3>
            <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.92rem' }}>
              <li><strong>Local de Coleta:</strong> {formData.endereco}, {formData.bairro} — Lavras-MG</li>
              <li><strong>Quantidade:</strong> {formData.quantidadeSacos} sacos de ráfia</li>
              <li><strong>Volume Calculado pela API:</strong> {calculo?.volumeEstimado} m³ (Faixa {calculo?.faixaPreco})</li>
              <li><strong>Valor Total ao Gerador:</strong> R$ {Number(calculo?.valorTotal).toFixed(2).replace('.', ',')}</li>
              <li><strong>Repasse ao Freteiro:</strong> R$ {Number(calculo?.valorRepasse).toFixed(2).replace('.', ',')} (80%)</li>
              <li><strong>Foto do Entulho:</strong> {fotoPreview ? 'Anexada com sucesso' : 'Não informada'}</li>
            </ul>
          </div>

          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('freteiro')}
              className="btn btn-secondary"
            >
              🚚 Ver como o Freteiro Visualiza este Pedido
            </button>
            <button
              onClick={() => setSubmetido(false)}
              className="btn btn-outline"
            >
              Editar Formulário
            </button>
          </div>
        </div>
      ) : (
        /* Formulário de Coleta */
        <form onSubmit={handleSubmit} className="grid-2">
          {/* Coluna 1: Dados do Imóvel e Foto */}
          <div className="card">
            <h2 className="card-title">1. Localização e Entulho</h2>
            <p className="card-subtitle">
              Onde o freteiro deve buscar os resíduos?
            </p>

            <div className="form-group">
              <label htmlFor="endereco" className="form-label">Endereço Completo (Rua e Número) *</label>
              <input
                id="endereco"
                type="text"
                name="endereco"
                required
                placeholder="Ex: Rua Monsenhor Aureliano, 240"
                value={formData.endereco}
                onChange={handleInputChange}
                className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bairro" className="form-label">Bairro em Lavras-MG *</label>
              <select
                id="bairro"
                name="bairro"
                value={formData.bairro}
                onChange={handleInputChange}
                className="form-select"
              >
                {bairrosLavras.map((b) => (
                  <option key={b} value={b}>{b}</option>
                ))}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="foto" className="form-label">Foto da Pilha de Sacos na Calçada *</label>
              <input
                id="foto"
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="form-input"
              />
              <span className="form-hint">
                A foto serve para o freteiro conferir o volume antes de aceitar o pedido.
              </span>
            </div>

            {fotoPreview && (
              <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                <img
                  src={fotoPreview}
                  alt="Prévia do entulho"
                  style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }}
                />
              </div>
            )}
          </div>

          {/* Coluna 2: Volume, Preço e Confirmação */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h2 className="card-title">2. Quantidade e Valores</h2>
              <p className="card-subtitle">
                O valor é calculado em tempo real pela API de precificação.
              </p>

              <div className="form-group">
                <label htmlFor="quantidadeSacos" className="form-label">Quantidade de Sacos Ensacados *</label>
                <input
                  id="quantidadeSacos"
                  type="number"
                  name="quantidadeSacos"
                  min="1"
                  max="50"
                  required
                  value={formData.quantidadeSacos}
                  onChange={handleInputChange}
                  className="form-input"
                  style={{ fontSize: '1.25rem', fontWeight: 700 }}
                />
                <span className="form-hint">Limite para pequenas reformas: 1 a 50 sacos de ráfia.</span>
              </div>

              {loadingCalculo && <LoadingSpinner inline text="Consultando backend..." />}

              {erroCalculo && (
                <AlertMessage type="error" message={erroCalculo} />
              )}

              {calculo && !loadingCalculo && (
                <div style={{
                  background: 'var(--bg-subtle)',
                  padding: '1.25rem',
                  borderRadius: 'var(--radius-md)',
                  margin: '1rem 0'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Faixa de Preço:</span>
                    <strong className="badge badge-primary">Faixa {calculo.faixaPreco}</strong>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                    <span style={{ color: 'var(--text-muted)' }}>Volume Estimado:</span>
                    <strong>{calculo.volumeEstimado} m³</strong>
                  </div>
                  <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.75rem 0' }} />
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                    <span style={{ fontWeight: 700 }}>Total a Pagar:</span>
                    <span style={{ fontSize: '1.75rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                      R$ {Number(calculo.valorTotal).toFixed(2).replace('.', ',')}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '0.2rem' }}>
                    Sem cobranças extras • Coleta garantida em 24h
                  </div>
                </div>
              )}
            </div>

            <button
              type="submit"
              disabled={!calculo || loadingCalculo}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              Confirmar Solicitação de Coleta
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
