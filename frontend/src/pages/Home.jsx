import React from 'react';

/**
 * Página Inicial do EcoObra
 */
export default function Home({ onNavigate }) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #064e3b 0%, #065f46 50%, #047857 100%)',
        color: 'white',
        borderRadius: 'var(--radius-lg)',
        padding: '3rem 2rem',
        boxShadow: 'var(--shadow-md)',
        position: 'relative',
        overflow: 'hidden'
      }}>
        <div style={{ maxWidth: '750px', position: 'relative', zIndex: 2 }}>
          <span className="badge" style={{ backgroundColor: 'rgba(255, 255, 255, 0.2)', color: 'white', marginBottom: '1rem' }}>
            Inovação em Sustentabilidade • Lavras-MG
          </span>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, lineHeight: 1.2, marginBottom: '1rem' }}>
            Descarte inteligente e rápido para pequenas reformas.
          </h1>
          <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: '1.75rem', lineHeight: 1.6 }}>
            Chega de entulho bloqueando sua calçada por dias ou caçambas caras para poucos sacos.
            O EcoObra calcula o preço justo pela quantidade de sacos, conecta você a freteiros credenciados
            e entrega o <strong>Comprovante Digital de Destinação em local autorizado</strong>.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button
              onClick={() => onNavigate('calculadora')}
              className="btn"
              style={{ backgroundColor: 'white', color: 'var(--primary-dark)', fontWeight: 700 }}
            >
              🧮 Simular Preço Agora
            </button>
            <button
              onClick={() => onNavigate('solicitar')}
              className="btn"
              style={{ backgroundColor: 'rgba(255, 255, 255, 0.15)', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)' }}
            >
              📦 Solicitar Coleta
            </button>
            <button
              onClick={() => onNavigate('locais')}
              className="btn"
              style={{ backgroundColor: 'transparent', color: 'white', border: '1px solid rgba(255, 255, 255, 0.3)' }}
            >
              📍 Ecopontos Autorizados
            </button>
          </div>
        </div>
      </section>

      {/* Como Funciona em 3 passos */}
      <section>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1.25rem', textAlign: 'center' }}>
          Como o EcoObra funciona
        </h2>
        <div className="grid-3">
          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>1️⃣</div>
            <h3 className="card-title">Informe os Sacos</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Conte os sacos de entulho (até 50 unidades / 1,5 m³) e veja o preço fixo na hora pela API oficial,
              sem surpresas ou negociação informal.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>2️⃣</div>
            <h3 className="card-title">Freteiro Credenciado</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              Um transportador local aceita o pedido organizado (endereço, foto e volume) e realiza a coleta
              em até 24 horas na sua calçada.
            </p>
          </div>

          <div className="card">
            <div style={{ fontSize: '2rem', marginBottom: '0.75rem' }}>3️⃣</div>
            <h3 className="card-title">Selo EcoDescarte</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem' }}>
              O resíduo é levado a um ecoponto autorizado de Lavras e você recebe o comprovante digital com
              foto da descarga para prestação de contas.
            </p>
          </div>
        </div>
      </section>

      {/* Tabela Oficial de Faixas de Preço */}
      <section className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '0.5rem' }}>
          <div>
            <h2 className="card-title" style={{ margin: 0 }}>Tabela Oficial de Precificação</h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.88rem' }}>
              Valores calculados e validados pelo backend para pequenas reformas residenciais
            </p>
          </div>
          <span className="badge badge-primary">Validado pelo Backend</span>
        </div>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.92rem' }}>
            <thead>
              <tr style={{ borderBottom: '2px solid var(--border)', color: 'var(--text-muted)' }}>
                <th style={{ padding: '0.75rem' }}>Faixa</th>
                <th style={{ padding: '0.75rem' }}>Quantidade de Sacos</th>
                <th style={{ padding: '0.75rem' }}>Volume Aprox.</th>
                <th style={{ padding: '0.75rem' }}>Preço ao Gerador</th>
                <th style={{ padding: '0.75rem' }}>Repasse ao Freteiro (80%)</th>
                <th style={{ padding: '0.75rem' }}>Taxa EcoObra (20%)</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem' }}><span className="badge badge-primary">P</span></td>
                <td style={{ padding: '0.75rem' }}>1 a 10 sacos</td>
                <td style={{ padding: '0.75rem' }}>até 0,30 m³</td>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary-dark)' }}>R$ 70,00</td>
                <td style={{ padding: '0.75rem' }}>R$ 56,00</td>
                <td style={{ padding: '0.75rem' }}>R$ 14,00</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem' }}><span className="badge badge-secondary">M</span></td>
                <td style={{ padding: '0.75rem' }}>11 a 25 sacos</td>
                <td style={{ padding: '0.75rem' }}>0,33 a 0,75 m³</td>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary-dark)' }}>R$ 110,00</td>
                <td style={{ padding: '0.75rem' }}>R$ 88,00</td>
                <td style={{ padding: '0.75rem' }}>R$ 22,00</td>
              </tr>
              <tr style={{ borderBottom: '1px solid var(--border)' }}>
                <td style={{ padding: '0.75rem' }}><span className="badge badge-accent">G</span></td>
                <td style={{ padding: '0.75rem' }}>26 a 50 sacos</td>
                <td style={{ padding: '0.75rem' }}>0,78 a 1,50 m³</td>
                <td style={{ padding: '0.75rem', fontWeight: 700, color: 'var(--primary-dark)' }}>R$ 170,00</td>
                <td style={{ padding: '0.75rem' }}>R$ 136,00</td>
                <td style={{ padding: '0.75rem' }}>R$ 34,00</td>
              </tr>
              <tr>
                <td style={{ padding: '0.75rem' }}><span className="badge badge-danger">Excedente</span></td>
                <td style={{ padding: '0.75rem' }}>Acima de 50 sacos</td>
                <td style={{ padding: '0.75rem' }}>&gt; 1,50 m³</td>
                <td colSpan={3} style={{ padding: '0.75rem', color: 'var(--danger)', fontStyle: 'italic' }}>
                  Fora do escopo de coleta fracionada (recomenda-se contratação de caçamba tradicional).
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Cards de Acesso Rápido */}
      <section className="grid-2">
        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="badge badge-primary" style={{ marginBottom: '0.5rem' }}>Para Moradores</div>
            <h3 className="card-title">Precisa liberar sua calçada?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
              Faça a simulação agora mesmo informando quantos sacos de entulho sua obra gerou. Veja o valor exato calculado pela API do backend.
            </p>
          </div>
          <button onClick={() => onNavigate('calculadora')} className="btn btn-primary">
            Acessar Simulador de Preço
          </button>
        </div>

        <div className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <div>
            <div className="badge badge-secondary" style={{ marginBottom: '0.5rem' }}>Para Freteiros</div>
            <h3 className="card-title">É transportador em Lavras?</h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.92rem', marginBottom: '1.25rem' }}>
              Descubra como o EcoObra organiza seus pedidos de frete com fotos, volume e repasse líquido de 80%, sem cobrança de comissão sobre a sua viagem.
            </p>
          </div>
          <button onClick={() => onNavigate('freteiro')} className="btn btn-secondary">
            Ver Painel do Freteiro
          </button>
        </div>
      </section>
    </div>
  );
}
