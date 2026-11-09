import React, { useState, useEffect, useCallback } from 'react';
import { precificacaoService } from '../services/precificacaoService';
import { pedidoService, comprimirImagem, formatarMoeda, formatarData, STATUS_LABEL } from '../services/pedidoService';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import ExigeLogin from '../components/ExigeLogin';

/**
 * Tela 1 – Solicitação de Coleta (Visão Gerador / Morador)
 * - POST /api/precificacao/calcular  → orçamento em tempo real
 * - POST /api/pedidos                → grava o pedido
 * - GET  /api/pedidos/gerador/{id}   → "Meus pedidos"
 */
export default function SolicitacaoColeta({ onNavigate, usuario }) {
  const [formData, setFormData] = useState({
    endereco: '',
    bairro: 'Centro',
    quantidadeSacos: 15
  });

  const [foto, setFoto] = useState(null);
  const [calculo, setCalculo] = useState(null);
  const [loadingCalculo, setLoadingCalculo] = useState(false);
  const [erroCalculo, setErroCalculo] = useState(null);
  const [enviando, setEnviando] = useState(false);
  const [erroEnvio, setErroEnvio] = useState(null);
  const [pedidoCriado, setPedidoCriado] = useState(null);
  const [meusPedidos, setMeusPedidos] = useState([]);
  const [loadingPedidos, setLoadingPedidos] = useState(false);

  const bairrosLavras = [
    'Centro', 'Centenário', 'Jardim Glória', 'Água Limpa', 'Vila São Francisco',
    'Nova Lavras', 'Belvedere', 'Vila Murad', 'Olavo Costa', 'Outro'
  ];

  const ehGerador = usuario?.perfil === 'GERADOR';

  const carregarMeusPedidos = useCallback(async () => {
    if (!ehGerador) return;
    setLoadingPedidos(true);
    try {
      setMeusPedidos(await pedidoService.doGerador(usuario.id));
    } catch {
      /* lista é complementar; erro aparece no banner de conexão */
    } finally {
      setLoadingPedidos(false);
    }
  }, [ehGerador, usuario?.id]);

  useEffect(() => { carregarMeusPedidos(); }, [carregarMeusPedidos]);

  // Atualiza cálculo sempre que a quantidade de sacos mudar
  useEffect(() => {
    let cancel = false;
    const qtd = Number(formData.quantidadeSacos);
    if (Number.isInteger(qtd) && qtd >= 1 && qtd <= 50) {
      setLoadingCalculo(true);
      setErroCalculo(null);
      precificacaoService.calcularPreco(qtd)
        .then((data) => { if (!cancel) setCalculo(data); })
        .catch((err) => { if (!cancel) setErroCalculo(err.message); })
        .finally(() => { if (!cancel) setLoadingCalculo(false); });
    } else {
      setCalculo(null);
      setErroCalculo(qtd > 50
        ? 'Acima de 50 sacos o volume passa de 1,5 m³: nesse caso recomendamos contratar uma caçamba.'
        : 'Informe uma quantidade entre 1 e 50 sacos.');
    }
    return () => { cancel = true; };
  }, [formData.quantidadeSacos]);

  if (!ehGerador) {
    return <ExigeLogin usuario={usuario} perfil="GERADOR" rotaAtual="solicitar" onNavigate={onNavigate} />;
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      setFoto(await comprimirImagem(file));
      setErroEnvio(null);
    } catch (err) {
      setErroEnvio(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.endereco.trim() || !formData.bairro) {
      setErroEnvio('Informe o endereço e o bairro da coleta.');
      return;
    }
    if (!foto) {
      setErroEnvio('Envie uma foto da pilha de sacos — o freteiro usa a foto para conferir o entulho.');
      return;
    }
    setEnviando(true);
    setErroEnvio(null);
    try {
      const pedido = await pedidoService.criar({
        geradorId: usuario.id,
        quantidadeSacos: formData.quantidadeSacos,
        enderecoColeta: formData.endereco,
        bairro: formData.bairro,
        fotoEntulho: foto
      });
      setPedidoCriado(pedido);
      carregarMeusPedidos();
    } catch (err) {
      setErroEnvio(err.message);
    } finally {
      setEnviando(false);
    }
  };

  const novoPedido = () => {
    setPedidoCriado(null);
    setFoto(null);
    setFormData({ endereco: '', bairro: 'Centro', quantidadeSacos: 15 });
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

      {pedidoCriado ? (
        <div className="card" style={{ border: '2px solid var(--primary)' }}>
          <AlertMessage
            type="success"
            title="Pedido enviado!"
            message="Os freteiros credenciados já podem ver sua solicitação. Acompanhe o status em “Meus pedidos” abaixo."
          />
          <ul style={{ listStyle: 'none', display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.92rem', margin: '1rem 0' }}>
            <li><strong>Pedido nº:</strong> {pedidoCriado.id}</li>
            <li><strong>Local de coleta:</strong> {pedidoCriado.enderecoColeta}, {pedidoCriado.bairro} — Lavras-MG</li>
            <li><strong>Quantidade:</strong> {pedidoCriado.quantidadeSacos} sacos ({pedidoCriado.volumeEstimado} m³, Faixa {pedidoCriado.faixaPreco})</li>
            <li><strong>Valor total:</strong> {formatarMoeda(pedidoCriado.valorTotal)} (pagamento simulado no MVP)</li>
            <li><strong>Status:</strong> {STATUS_LABEL[pedidoCriado.status]?.texto}</li>
          </ul>
          <button onClick={novoPedido} className="btn btn-outline">Fazer outra solicitação</button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="grid-2">
          {/* Coluna 1: Dados do Imóvel e Foto */}
          <div className="card">
            <h2 className="card-title">1. Localização e Entulho</h2>
            <p className="card-subtitle">Onde o freteiro deve buscar os resíduos?</p>

            <div className="form-group">
              <label htmlFor="endereco" className="form-label">Endereço Completo (Rua e Número) *</label>
              <input
                id="endereco" type="text" name="endereco" required
                placeholder="Ex: Rua Monsenhor Aureliano, 240"
                value={formData.endereco} onChange={handleInputChange} className="form-input"
              />
            </div>

            <div className="form-group">
              <label htmlFor="bairro" className="form-label">Bairro em Lavras-MG *</label>
              <select id="bairro" name="bairro" value={formData.bairro} onChange={handleInputChange} className="form-select">
                {bairrosLavras.map((b) => <option key={b} value={b}>{b}</option>)}
              </select>
            </div>

            <div className="form-group">
              <label htmlFor="foto" className="form-label">Foto da Pilha de Sacos na Calçada *</label>
              <input id="foto" type="file" accept="image/*" capture="environment" onChange={handleFileChange} className="form-input" />
              <span className="form-hint">A foto serve para o freteiro conferir o volume antes de aceitar o pedido.</span>
            </div>

            {foto && (
              <div style={{ marginTop: '0.75rem', textAlign: 'center' }}>
                <img src={foto} alt="Prévia do entulho"
                  style={{ maxHeight: '180px', maxWidth: '100%', borderRadius: 'var(--radius-md)', border: '1px solid var(--border)' }} />
              </div>
            )}
          </div>

          {/* Coluna 2: Volume, Preço e Confirmação */}
          <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <h2 className="card-title">2. Quantidade e Valores</h2>
              <p className="card-subtitle">O valor é calculado em tempo real pela API de precificação.</p>

              <div className="form-group">
                <label htmlFor="quantidadeSacos" className="form-label">Quantidade de Sacos Ensacados *</label>
                <input
                  id="quantidadeSacos" type="number" name="quantidadeSacos" min="1" max="50" required
                  value={formData.quantidadeSacos} onChange={handleInputChange} className="form-input"
                  style={{ fontSize: '1.25rem', fontWeight: 700 }}
                />
                <span className="form-hint">Limite para pequenas reformas: 1 a 50 sacos de ráfia.</span>
              </div>

              {loadingCalculo && <LoadingSpinner inline text="Consultando backend..." />}
              {erroCalculo && <AlertMessage type="error" message={erroCalculo} />}

              {calculo && !loadingCalculo && !erroCalculo && (
                <div style={{ background: 'var(--bg-subtle)', padding: '1.25rem', borderRadius: 'var(--radius-md)', margin: '1rem 0' }}>
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
                      {formatarMoeda(calculo.valorTotal)}
                    </span>
                  </div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', textAlign: 'right', marginTop: '0.2rem' }}>
                    Sem cobranças extras • Coleta em até 24h
                  </div>
                </div>
              )}
            </div>

            {erroEnvio && <AlertMessage type="error" message={erroEnvio} onClose={() => setErroEnvio(null)} />}

            <button
              type="submit"
              disabled={!calculo || loadingCalculo || !!erroCalculo || enviando}
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
            >
              {enviando ? 'Enviando pedido...' : 'Confirmar Solicitação de Coleta'}
            </button>
          </div>
        </form>
      )}

      {/* Meus pedidos */}
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
          <h2 className="card-title" style={{ margin: 0 }}>Meus pedidos</h2>
          <button className="btn btn-outline btn-sm" onClick={carregarMeusPedidos}>🔄 Atualizar</button>
        </div>
        {loadingPedidos && <LoadingSpinner inline text="Carregando..." />}
        {!loadingPedidos && meusPedidos.length === 0 && (
          <p className="card-subtitle" style={{ marginTop: '0.75rem' }}>Você ainda não fez nenhuma solicitação.</p>
        )}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.75rem' }}>
          {meusPedidos.map((p) => (
            <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '1rem', flexWrap: 'wrap', padding: '0.75rem', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)' }}>
              <div style={{ fontSize: '0.9rem' }}>
                <strong>Pedido nº {p.id}</strong> — {p.quantidadeSacos} sacos • {formatarMoeda(p.valorTotal)}
                <div style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
                  {p.enderecoColeta}, {p.bairro} • {formatarData(p.dataCriacao)}
                  {p.freteiro && <> • Freteiro: {p.freteiro.nome}</>}
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className={`badge ${STATUS_LABEL[p.status]?.classe}`}>{STATUS_LABEL[p.status]?.texto}</span>
                {p.status === 'CONCLUIDO' && (
                  <button className="btn btn-primary btn-sm" onClick={() => onNavigate('comprovante', p.id)}>
                    📜 Ver comprovante
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
