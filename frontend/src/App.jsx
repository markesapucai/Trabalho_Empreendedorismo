import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import BackendBanner from './components/BackendBanner';
import Home from './pages/Home';
import CalculadoraPreco from './pages/CalculadoraPreco';
import LocaisDescarte from './pages/LocaisDescarte';
import SolicitacaoColeta from './pages/SolicitacaoColeta';
import PainelFreteiro from './pages/PainelFreteiro';
import ComprovanteSelo from './pages/ComprovanteSelo';
import StatusSistema from './pages/StatusSistema';
import Login from './pages/Login';
import { authService } from './services/authService';

const VALID_ROUTES = ['home', 'calculadora', 'locais', 'solicitar', 'freteiro', 'comprovante', 'status', 'entrar'];

/** Lê "#rota/parametro" (ex.: #comprovante/12) */
function lerHash() {
  const [rota, param] = window.location.hash.replace('#', '').split('/');
  return {
    route: VALID_ROUTES.includes(rota) ? rota : 'home',
    param: param ? decodeURIComponent(param) : null
  };
}

export default function App() {
  const [{ route: activeRoute, param }, setRota] = useState(lerHash);
  const [usuario, setUsuario] = useState(() => authService.usuarioAtual());

  const navigateTo = (route, routeParam = null) => {
    setRota({ route, param: routeParam });
    window.location.hash = routeParam != null ? `${route}/${encodeURIComponent(routeParam)}` : route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => setRota(lerHash());
    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  const handleLogin = (u) => {
    setUsuario(u);
    // Depois do login, volta para onde a pessoa queria ir (ou para a tela do perfil dela)
    const destino = param && VALID_ROUTES.includes(param)
      ? param
      : u.perfil === 'FRETEIRO' ? 'freteiro' : 'solicitar';
    navigateTo(destino);
  };

  const handleLogout = () => {
    authService.sair();
    setUsuario(null);
    navigateTo('home');
  };

  const renderPage = () => {
    switch (activeRoute) {
      case 'home':
        return <Home onNavigate={navigateTo} />;
      case 'calculadora':
        return <CalculadoraPreco onNavigate={navigateTo} />;
      case 'locais':
        return <LocaisDescarte />;
      case 'solicitar':
        return <SolicitacaoColeta onNavigate={navigateTo} usuario={usuario} />;
      case 'freteiro':
        return <PainelFreteiro onNavigate={navigateTo} usuario={usuario} />;
      case 'comprovante':
        return <ComprovanteSelo pedidoId={param} onNavigate={navigateTo} usuario={usuario} />;
      case 'status':
        return <StatusSistema />;
      case 'entrar':
        return <Login onLogin={handleLogin} />;
      default:
        return <Home onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="app-container">
      <BackendBanner />
      <Navbar activeRoute={activeRoute} onNavigate={navigateTo} usuario={usuario} onLogout={handleLogout} />
      <main className="main-content">
        {renderPage()}
      </main>
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
