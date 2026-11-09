import React, { useState } from 'react';

/**
 * Barra de navegação principal com suporte a menu mobile e links para todas as áreas
 */
export default function Navbar({ activeRoute, onNavigate, usuario, onLogout }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'home', label: 'Início', icon: '🏠' },
    { id: 'calculadora', label: 'Simulador de Preço', icon: '🧮', badge: 'API' },
    { id: 'locais', label: 'Locais de Descarte', icon: '📍', badge: 'API' },
    { id: 'solicitar', label: 'Solicitar Coleta', icon: '📦' },
    { id: 'freteiro', label: 'Painel do Freteiro', icon: '🚚' },
    { id: 'comprovante', label: 'Selo EcoDescarte', icon: '📜' },
    { id: 'status', label: 'Diagnóstico', icon: '⚙️' }
  ];

  const handleNavClick = (id) => {
    onNavigate(id);
    setMobileMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-inner">
        <div className="brand" onClick={() => handleNavClick('home')} role="button" tabIndex={0}>
          <div className="brand-icon">🌱</div>
          <span>EcoObra</span>
        </div>

        <button
          className="mobile-menu-toggle"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Abrir menu"
        >
          {mobileMenuOpen ? '✕' : '☰'}
        </button>

        <nav>
          <ul className={`nav-links ${mobileMenuOpen ? 'open' : ''}`}>
            {navItems.map((item) => (
              <li key={item.id}>
                <button
                  className={`nav-link-btn ${activeRoute === item.id ? 'active' : ''}`}
                  onClick={() => handleNavClick(item.id)}
                >
                  <span>{item.icon}</span>
                  <span>{item.label}</span>
                  {item.badge && (
                    <span className="badge badge-primary" style={{ fontSize: '0.65rem', padding: '0.1rem 0.4rem' }}>
                      {item.badge}
                    </span>
                  )}
                </button>
              </li>
            ))}
            <li>
              {usuario ? (
                <button className="nav-link-btn" onClick={() => { onLogout(); setMobileMenuOpen(false); }} title="Sair">
                  <span>{usuario.perfil === 'FRETEIRO' ? '🚚' : '🏠'}</span>
                  <span>{usuario.nome.split(' ')[0]} · Sair</span>
                </button>
              ) : (
                <button className={`nav-link-btn ${activeRoute === 'entrar' ? 'active' : ''}`} onClick={() => handleNavClick('entrar')}>
                  <span>👤</span>
                  <span>Entrar</span>
                </button>
              )}
            </li>
          </ul>
        </nav>
      </div>
    </header>
  );
}
