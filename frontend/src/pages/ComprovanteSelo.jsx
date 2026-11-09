import React, { useState, useEffect } from 'react';
import AlertMessage from '../components/AlertMessage';
import LoadingSpinner from '../components/LoadingSpinner';
import { pedidoService, formatarData, formatarMoeda } from '../services/pedidoService';

/**
 * Tela 3 – Comprovante Digital de Destinação (Selo EcoDescarte)
 * GET /api/pedidos/{id}/comprovante — só existe para pedidos CONCLUIDOS.
 * URL: #comprovante/{id}
 */
export default function ComprovanteSelo({ pedidoId, onNavigate, usuario }) {
  const [comprovante, setComprovante] = useState(null);
  const [carregando, setCarregando] = useState(false);
  const [erro, setErro] = useState(null);
  const [busca, setBusca] = useState('');
  const [concluidos, setConcluidos] = useState([]);

  useEffect(() => {
    let cancel = false;
    setComprovante(null);
    setErro(null);
    if (!pedidoId) return;
    setCarregando(true);
    pedidoService.comprovante(pedidoId)
      .then((c) => { if (!cancel) setComprovante(c); })
      .catch((err) => {
        if (cancel) return;
        if (err.status === 409) setErro('Esta coleta ainda não foi concluída. O comprovante é emitido quando o freteiro registra o descarte.');
        else if (err.status === 404) setErro(`Pedido nº ${pedidoId} não encontrado.`);
        else setErro(err.message);
      })
      .finally(() => { if (!cancel) setCarregando(false); });
    return () => { cancel = true; };
  }, [pedidoId]);

  // Sem id na URL: mostra os comprovantes do usuário logado
  useEffect(() => {
    if (pedidoId || !usuario) return;
    const req = usuario.perfil === 'FRETEIRO' ? pedidoService.doFreteiro(usuario.id) : pedidoService.doGerador(usuario.id);
    req.then((lista) => setConcluidos(lista.filter((p) => p.status === 'CONCLUIDO'))).catch(() => {});
  }, [pedidoId, usuario]);

  const buscar = (e) => {
    e.preventDefault();
    const id = busca.trim();
    if (/^\d+$/.test(id)) onNavigate('comprovante', id);
    else setErro('Digite o número do pedido (somente números).');
  };

  if (!pedidoId) {
    return (
      <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', maxWidth: '640px', margin: '0 auto', width: '100%' }}>
        <div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Comprovante Digital de Destinação</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Consulte o Selo EcoDescarte de uma coleta concluída.
          </p>
        </div>
        {erro && <AlertMessage type="error" message={erro} onClose={() => setErro(null)} />}
        <form onSubmit={buscar} className="card" style={{ display: 'flex', gap: '0.75rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: 1, margin: 0 }}>
            <label htmlFor="busca" className="form-label">Número do pedido</label>
            <input id="busca" className="form-input" inputMode="numeric" value={busca} onChange={(e) => setBusca(e.target.value)} placeholder="Ex.: 12" />
          </div>
          <button className="btn btn-primary" type="submit">Ver comprovante</button>
        </form>
        {concluidos.length > 0 && (
          <div className="card">
            <h2 className="card-title">Seus comprovantes</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {concluidos.map((p) => (
                <button key={p.id} className="btn btn-outline" style={{ justifyContent: 'space-between', textAlign: 'left' }}
                  onClick={() => onNavigate('comprovante', p.id)}>
                  Pedido nº {p.id} — {p.bairro} • {p.quantidadeSacos} sacos • {formatarData(p.dataConclusao)}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  }

  if (carregando) return <LoadingSpinner text="Carregando comprovante..." />;

  if (erro || !comprovante) {
    return (
      <div style={{ maxWidth: '640px', margin: '0 auto', width: '100%', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <AlertMessage type="warning" message={erro || 'Comprovante indisponível.'} />
        <button className="btn btn-outline" onClick={() => onNavigate('comprovante')}>← Buscar outro pedido</button>
      </div>
    );
  }

  const c = comprovante;
  const local = c.localDescarte;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.75rem', maxWidth: '800px', margin: '0 auto', width: '100%' }}>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
            <span className="badge badge-primary">Wireframe 3 • Entrega 3</span>
            <span className="badge badge-neutral">Diferencial Central do Produto</span>
          </div>
          <h1 style={{ fontSize: '1.85rem', fontWeight: 800 }}>Comprovante Digital de Destinação</h1>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem' }}>
            Documento de destinação para moradores, condomínios e comerciantes.
          </p>
        </div>
        <button onClick={() => window.print()} className="btn btn-primary">🖨️ Imprimir / Salvar PDF</button>
      </div>

      <div className="selo-card">
        <div className="selo-stamp">🌱 Selo EcoDescarte<br />Lavras-MG</div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', fontWeight: 700, textTransform: 'uppercase' }}>
            Comprovante de Destinação de Resíduos da Construção Civil
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
            Pedido nº {c.pedidoId}
          </h2>
          <span className="badge badge-primary" style={{ marginTop: '0.4rem' }}>✓ COLETA CONCLUÍDA</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Gerador do resíduo:</div>
            <strong>{c.geradorNome}</strong>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Origem do resíduo:</div>
            <strong>{c.enderecoColeta} — {c.bairro}, Lavras-MG</strong>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Volume coletado:</div>
            <strong>{c.quantidadeSacos} sacos ({String(c.volumeEstimado).replace('.', ',')} m³) — Faixa {c.faixaPreco}</strong>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Transportador credenciado:</div>
            <strong>{c.freteiroNome}</strong>
            {c.veiculo && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{c.veiculo}</div>}
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Solicitado em / coletado em:</div>
            <strong>{formatarData(c.dataSolicitacao)} / {formatarData(c.dataColeta)}</strong>
          </div>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Descarte registrado em:</div>
            <strong>{formatarData(c.dataConclusao)}</strong>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Valor do serviço: {formatarMoeda(c.valorTotal)}</div>
          </div>
        </div>

        <div style={{ background: 'white', border: '1px solid var(--border)', borderRadius: 'var(--radius-md)', padding: '1.25rem', marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary-dark)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            📍 Local de descarte autorizado
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>{local?.nome}</div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            {local?.endereco} — {local?.bairro}, {local?.cidade}
          </div>
        </div>

        <div style={{ background: 'white', border: '1px dashed var(--border)', borderRadius: 'var(--radius-md)', padding: '1rem', textAlign: 'center' }}>
          <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
            📸 <strong>Foto da descarga</strong> anexada pelo freteiro
          </div>
          {c.fotoDescarga
            ? <img src={c.fotoDescarga} alt="Foto da descarga no local autorizado" style={{ maxWidth: '100%', maxHeight: '320px', borderRadius: 'var(--radius-md)' }} />
            : <span style={{ color: 'var(--text-light)' }}>Sem foto</span>}
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-light)', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>Código de autenticidade: {c.codigoAutenticidade}</span>
          <span>EcoObra Plataforma Digital • Lavras-MG</span>
        </div>
      </div>
    </div>
  );
}
