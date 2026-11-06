import React from 'react';

/**
 * Tela 3 – Comprovante Digital de Destinação (Selo EcoDescarte)
 * Baseada nas especificações e wireframes da Entrega 3
 */
export default function ComprovanteSelo() {
  const dadosExemplo = {
    codigoPedido: 'ECO-2026-084',
    dataHora: '06/11/2026 às 10:15',
    geradorNome: 'Dona Célia (Moradora)',
    enderecoColeta: 'Rua das Camélias, 120 — Jardim Glória, Lavras-MG',
    quantidadeSacos: 15,
    volumeEstimado: '0,45 m³',
    faixa: 'Faixa M',
    freteiroNome: 'Jorge da Silva (Freteiro Credenciado)',
    veiculo: 'Picape Utilitária — Placa GWA-4890',
    localDescarte: 'Ecoponto Municipal Norte (Licença Ambiental nº 2024/098)',
    status: 'CONCLUÍDO E VERIFICADO',
    autenticidadeHash: 'a89f-7c12-44e2-b789-9941a'
  };

  const handlePrint = () => {
    window.print();
  };

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
            Documento de conformidade ambiental para moradores, condomínios e comerciantes.
          </p>
        </div>
        <button onClick={handlePrint} className="btn btn-primary">
          🖨️ Imprimir / Salvar PDF
        </button>
      </div>

      {/* Cartão Oficial com Selo */}
      <div className="selo-card">
        <div className="selo-stamp">
          🌱 Selo EcoDescarte<br />Lavras-MG
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ fontSize: '0.85rem', color: 'var(--primary-dark)', fontWeight: 700, textTransform: 'uppercase' }}>
            Certificado de Destinação Correta de Resíduos da Construção Civil
          </div>
          <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-main)', marginTop: '0.2rem' }}>
            Pedido #{dadosExemplo.codigoPedido}
          </h2>
          <span className="badge badge-primary" style={{ marginTop: '0.4rem' }}>
            ✓ {dadosExemplo.status}
          </span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '1.5rem' }}>
          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Data e Horário da Coleta:</div>
            <strong>{dadosExemplo.dataHora}</strong>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Volume Coletado:</div>
            <strong>{dadosExemplo.quantidadeSacos} sacos ({dadosExemplo.volumeEstimado}) — {dadosExemplo.faixa}</strong>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Origem do Resíduo:</div>
            <strong>{dadosExemplo.enderecoColeta}</strong>
          </div>

          <div>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Transportador Credenciado:</div>
            <strong>{dadosExemplo.freteiroNome}</strong>
            <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{dadosExemplo.veiculo}</div>
          </div>
        </div>

        {/* Local de Descarte Autorizado */}
        <div style={{
          background: 'white',
          border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.25rem',
          marginBottom: '1.5rem'
        }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--primary-dark)', fontWeight: 700, textTransform: 'uppercase', marginBottom: '0.3rem' }}>
            📍 Destinação Final Registrada e Auditada
          </div>
          <div style={{ fontSize: '1.1rem', fontWeight: 700 }}>
            {dadosExemplo.localDescarte}
          </div>
          <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
            Conformidade com a Resolução CONAMA nº 307/2002 e Plano Municipal de Gestão Integrada de Resíduos de Lavras.
          </div>
        </div>

        {/* Espaço para Foto da Descarga */}
        <div style={{
          background: 'white',
          border: '1px dashed var(--border)',
          borderRadius: 'var(--radius-md)',
          padding: '1.5rem',
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.9rem'
        }}>
          📸 <strong>Registro Fotográfico da Descarga no Ecoponto</strong>
          <div style={{ fontSize: '0.8rem', marginTop: '0.3rem', color: 'var(--text-light)' }}>
            Foto anexada pelo freteiro no momento da descarga autorizada.
          </div>
        </div>

        <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', color: 'var(--text-light)', flexWrap: 'wrap', gap: '0.5rem' }}>
          <span>Código de Autenticidade: {dadosExemplo.autenticidadeHash}</span>
          <span>EcoObra Plataforma Digital • Lavras-MG</span>
        </div>
      </div>
    </div>
  );
}
