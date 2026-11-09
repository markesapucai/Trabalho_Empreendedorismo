import React, { useState, useEffect, useCallback } from 'react';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import ExigeLogin from '../components/ExigeLogin';
import { pedidoService, comprimirImagem, formatarMoeda, formatarData, STATUS_LABEL } from '../services/pedidoService';
import { localDescarteService } from '../services/localDescarteService';

/**
 * Tela 2 – Painel do Freteiro
 * - GET  /api/pedidos/pendentes         → corridas abertas
 * - POST /api/pedidos/{id}/aceitar      → aceite (com lock no backend)
 * - GET  /api/pedidos/freteiro/{id}     → minhas coletas
 * - POST /api/pedidos/{id}/concluir     → encerra com local de descarte + foto
 */
export default function PainelFreteiro({ onNavigate, usuario }) {
  const [pendentes, setPendentes] = useState([]);
  const [minhas, setMinhas] = useState([]);
  const [locais, setLocais] = useState([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState(null);
  const [aviso, setAviso] = useState(null);
  const [processando, setProcessando] = useState(null); // id do pedido em ação
  const [conclusao, setConclusao] = useState({}); // { [pedidoId]: { localDescarteId, foto } }
  const [fotoAmpliada, setFotoAmpliada] = useState(null);

  const ehFreteiro = usuario?.perfil === 'FRETEIRO';

  const carregar = useCallback(async () => {
    if (!ehFreteiro) return;
    setCarregando(true);
    setErro(null);
    try {
      const [pend, mine, locs] = await Promise.all([
        pedidoService.pendentes(),
        pedidoService.doFreteiro(usuario.id),
        localDescarteService.listarAtivos()
      ]);
      setPendentes(pend);
      setMinhas(mine);
      setLocais(locs);
    } catch (err) {
      setErro(err.message);
    } finally {
      setCarregando(false);
    }
  }, [ehFreteiro, usuario?.id]);

  useEffect(() => { carregar(); }, [carregar]);

  if (!ehFreteiro) {
    return <ExigeLogin usuario={usuario} perfil="FRETEIRO" rotaAtual="freteiro" onNavigate={onNavigate} />;
  }

  const aceitar = async (pedido) => {
    setProcessando(pedido.id);
    setErro(null);
    setAviso(null);
    try {
      await pedidoService.aceitar(pedido.id, usuario.id);
      setAviso(`Pedido nº ${pedido.id} aceito! Faça a coleta em ${pedido.enderecoColeta}, ${pedido.bairro}.`);
    } catch (err) {
      // 409 = outro freteiro aceitou primeiro
      setErro(err.status === 409 ? 'Outro freteiro aceitou este pedido antes de você.' : err.message);
    } finally {
      setProcessando(null);
      carregar();
    }
  };

  const setCampoConclusao = (id, campo, valor) =>
    setConclusao((c) => ({ ...c, [id]: { ...c[id], [campo]: valor } }));

  const handleFotoDescarga = async (id, file) => {
    if (!file) return;
    try {
      setCampoConclusao(id, 'foto', await comprimirImagem(file));
    } catch (err) {
      setErro(err.message);
    }
  };

  const concluir = async (pedido) => {
    const dados = conclusao[pedido.id] || {};
    if (!dados.localDescarteId) return setErro('Selecione o local de descarte autorizado onde o entulho foi deixado.');
    if (!dados.foto) return setErro('Anexe a foto da descarga — ela aparece no comprovante do morador.');
    setProcessando(pedido.id);
    setErro(null);
    setAviso(null);
    try {
      await pedidoService.concluir(pedido.id, {
        freteiroId: usuario.id,
        localDescarteId: dados.localDescarteId,
        fotoDescarga: dados.foto
      });
      setAviso(`Coleta nº ${pedido.id} concluída. O comprovante já está disponível para o morador.`);
    } catch (err) {
      setErro(err.message);
    } finally {
      setProcessando(null);
      carregar();
    }
  };

  const emAndamento = minhas.filter((p) => p.status === 'ACEITO');
  const concluidas = minhas.filter((p) => p.status === 'CONCLUIDO');

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem' }}>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-secondary">Wireframe 2 • Entrega 3</span>
            <span className="badge badge-neutral">Visão do Transportador</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Painel de Pedidos para Freteiros</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Corridas disponíveis em Lavras com volume, foto e repasse de 80% do valor.
          </p>
        </div>
        <button className="btn btn-outline btn-sm" onClick={carregar} disabled={carregando}>🔄 Atualizar</button>
      </div>

      {erro && <AlertMessage type="error" message={erro} onClose={() => setErro(null)} />}
      {aviso && <AlertMessage type="success" message={aviso} onClose={() => setAviso(null)} />}
      {carregando && <LoadingSpinner inline text="Carregando pedidos..." />}

      {/* Coletas em andamento */}
      {emAndamento.length > 0 && (
        <div>
          <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
            Minhas coletas em andamento ({emAndamento.length})
          </h2>
          <div className="grid-2">
            {emAndamento.map((p) => (
              <div key={p.id} className="card" style={{ border: '2px solid var(--secondary)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span className="badge badge-neutral">Pedido nº {p.id}</span>
                  <span className="badge badge-secondary">{STATUS_LABEL[p.status].texto}</span>
                </div>
                <div style={{ fontWeight: 700 }}>📍 {p.enderecoColeta}, {p.bairro}</div>
                <div style={{ fontSize: '0.88rem', color: 'var(--text-muted)', marginBottom: '0.75rem' }}>
                  {p.quantidadeSacos} sacos ({p.volumeEstimado} m³) • Repasse {formatarMoeda(p.valorRepasse)}
                  {p.gerador?.telefone && <> • Contato: {p.gerador.nome} {p.gerador.telefone}</>}
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor={`local-${p.id}`}>Local de descarte autorizado *</label>
                  <select
                    id={`local-${p.id}`}
                    className="form-select"
                    value={conclusao[p.id]?.localDescarteId || ''}
                    onChange={(e) => setCampoConclusao(p.id, 'localDescarteId', e.target.value)}
                  >
                    <option value="">Selecione...</option>
                    {locais.map((l) => <option key={l.id} value={l.id}>{l.nome} — {l.bairro}</option>)}
                  </select>
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor={`foto-${p.id}`}>Foto da descarga *</label>
                  <input
                    id={`foto-${p.id}`} type="file" accept="image/*" capture="environment" className="form-input"
                    onChange={(e) => handleFotoDescarga(p.id, e.target.files[0])}
                  />
                  {conclusao[p.id]?.foto && (
                    <img src={conclusao[p.id].foto} alt="Prévia da descarga"
                      style={{ marginTop: '0.5rem', maxHeight: '120px', maxWidth: '100%', borderRadius: 'var(--radius-md)' }} />
                  )}
                </div>
                <button className="btn btn-primary" style={{ width: '100%' }}
                  disabled={processando === p.id} onClick={() => concluir(p)}>
                  {processando === p.id ? 'Enviando...' : '✅ Concluir coleta e emitir comprovante'}
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pedidos abertos */}
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
          Pedidos abertos ({pendentes.length})
        </h2>
        {!carregando && pendentes.length === 0 && (
          <p style={{ color: 'var(--text-muted)' }}>Nenhum pedido aberto no momento. Clique em “Atualizar” para conferir de novo.</p>
        )}
        <div className="grid-3">
          {pendentes.map((p) => (
            <div key={p.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-neutral">Pedido nº {p.id}</span>
                  <span className="badge badge-primary">Faixa {p.faixaPreco}</span>
                </div>

                {p.fotoEntulho ? (
                  <img src={p.fotoEntulho} alt={`Entulho do pedido ${p.id}`} onClick={() => setFotoAmpliada(p.fotoEntulho)}
                    style={{ width: '100%', height: '140px', objectFit: 'cover', borderRadius: 'var(--radius-md)', marginBottom: '1rem', cursor: 'zoom-in' }} />
                ) : (
                  <div style={{ background: 'var(--bg-subtle)', height: '110px', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)', fontSize: '0.88rem', marginBottom: '1rem', border: '1px dashed var(--border)' }}>
                    Sem foto
                  </div>
                )}

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>📍 {p.bairro}</div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{p.enderecoColeta}</div>
                  <div style={{ fontSize: '0.88rem' }}>📦 <strong>{p.quantidadeSacos} sacos</strong> ({p.volumeEstimado} m³)</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Solicitado em {formatarData(p.dataCriacao)}</div>
                </div>
              </div>

              <div>
                <div style={{ background: 'var(--primary-light)', padding: '0.75rem', borderRadius: 'var(--radius-md)', textAlign: 'center', marginBottom: '0.75rem' }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary-dark)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Seu repasse (80%)
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                    {formatarMoeda(p.valorRepasse)}
                  </div>
                </div>
                <button onClick={() => aceitar(p)} disabled={processando === p.id} className="btn btn-primary" style={{ width: '100%' }}>
                  {processando === p.id ? 'Aceitando...' : 'Aceitar Coleta'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Histórico */}
      {concluidas.length > 0 && (
        <div className="card">
          <h2 className="card-title">Coletas concluídas ({concluidas.length})</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            {concluidas.map((p) => (
              <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem', fontSize: '0.9rem', padding: '0.5rem 0', borderBottom: '1px solid var(--border)' }}>
                <span>
                  <strong>Nº {p.id}</strong> — {p.bairro} • {p.quantidadeSacos} sacos • {formatarMoeda(p.valorRepasse)}
                  <span style={{ color: 'var(--text-muted)' }}> • {p.localDescarte?.nome} • {formatarData(p.dataConclusao)}</span>
                </span>
                <button className="btn btn-outline btn-sm" onClick={() => onNavigate('comprovante', p.id)}>📜 Comprovante</button>
              </div>
            ))}
          </div>
        </div>
      )}

      {fotoAmpliada && (
        <div onClick={() => setFotoAmpliada(null)}
          style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, cursor: 'zoom-out', padding: '1rem' }}>
          <img src={fotoAmpliada} alt="Foto ampliada" style={{ maxWidth: '100%', maxHeight: '100%', borderRadius: 'var(--radius-md)' }} />
        </div>
      )}
    </div>
  );
}
