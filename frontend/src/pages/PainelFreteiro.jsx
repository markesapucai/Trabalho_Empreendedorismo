import React, { useState } from 'react';
import AlertMessage from '../components/AlertMessage';

/**
 * Tela 2 – Painel do Freteiro
 * Baseada nas especificações e wireframes da Entrega 3
 */
export default function PainelFreteiro() {
  const [pedidosSimulados] = useState([
    {
      codigo: 'ECO-2026-084',
      bairro: 'Jardim Glória',
      endereco: 'Rua das Camélias, 120',
      quantidadeSacos: 15,
      volume: '0.45 m³',
      faixa: 'M',
      repasse: 'R$ 88,00',
      fotoPlaceholder: '🧱 15 sacos de reboco e azulejo',
      status: 'PENDENTE'
    },
    {
      codigo: 'ECO-2026-085',
      bairro: 'Centenário',
      endereco: 'Av. Pedro Sales, 450',
      quantidadeSacos: 8,
      volume: '0.24 m³',
      faixa: 'P',
      repasse: 'R$ 56,00',
      fotoPlaceholder: '🧱 8 sacos de caliça e piso quebrado',
      status: 'PENDENTE'
    },
    {
      codigo: 'ECO-2026-086',
      bairro: 'Centro',
      endereco: 'Rua Santana, 88',
      quantidadeSacos: 30,
      volume: '0.90 m³',
      faixa: 'G',
      repasse: 'R$ 136,00',
      fotoPlaceholder: '🧱 30 sacos de reforma comercial',
      status: 'PENDENTE'
    }
  ]);

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
            Corridas disponíveis em Lavras com volume, fotos e repasse líquido garantido de 80%.
          </p>
        </div>
      </div>

      {/* Alerta de Transparência sobre o Backend */}
      <AlertMessage
        type="info"
        title="Status de Integração do Painel do Freteiro"
        message="A entidade Pedido e o método PedidoRepository.lockById() já foram criados no backend, porém os endpoints de listagem de pedidos abertos (GET /api/pedidos/pendentes) e aceite concorrente (POST /api/pedidos/{id}/aceitar) ainda não foram expostos via Controller no Spring Boot. Abaixo está a interface representativa conforme wireframe validado."
      />

      {/* Grid de Pedidos Abertos */}
      <div>
        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>
          Pedidos Abertos Próximos a Você ({pedidosSimulados.length})
        </h2>

        <div className="grid-3">
          {pedidosSimulados.map((p) => (
            <div key={p.codigo} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                  <span className="badge badge-neutral">{p.codigo}</span>
                  <span className="badge badge-primary">Faixa {p.faixa}</span>
                </div>

                <div style={{
                  background: 'var(--bg-subtle)',
                  height: '110px',
                  borderRadius: 'var(--radius-md)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'var(--text-muted)',
                  fontSize: '0.88rem',
                  padding: '1rem',
                  textAlign: 'center',
                  marginBottom: '1rem',
                  border: '1px dashed var(--border)'
                }}>
                  {p.fotoPlaceholder}
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', marginBottom: '1rem' }}>
                  <div style={{ fontWeight: 700, fontSize: '1.1rem' }}>
                    📍 {p.bairro}
                  </div>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                    {p.endereco}
                  </div>
                  <div style={{ fontSize: '0.88rem' }}>
                    📦 <strong>{p.quantidadeSacos} sacos</strong> ({p.volume})
                  </div>
                </div>
              </div>

              <div>
                <div style={{
                  background: 'var(--primary-light)',
                  padding: '0.75rem',
                  borderRadius: 'var(--radius-md)',
                  textAlign: 'center',
                  marginBottom: '0.75rem'
                }}>
                  <div style={{ fontSize: '0.75rem', color: 'var(--primary-dark)', textTransform: 'uppercase', fontWeight: 600 }}>
                    Seu Repasse Líquido (80%)
                  </div>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--primary-dark)' }}>
                    {p.repasse}
                  </div>
                </div>

                <button
                  onClick={() => alert(`Aceite do pedido ${p.codigo}: Este fluxo acionará o método PedidoRepository.lockById() assim que o endpoint /api/pedidos/${p.codigo}/aceitar for implementado.`)}
                  className="btn btn-primary"
                  style={{ width: '100%' }}
                >
                  Aceitar Coleta
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
