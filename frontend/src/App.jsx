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

export default function App() {
  // Sincroniza a rota inicial a partir do hash da URL se presente
  const getInitialRoute = () => {
    const hash = window.location.hash.replace('#', '');
    const validRoutes = ['home', 'calculadora', 'locais', 'solicitar', 'freteiro', 'comprovante', 'status'];
    return validRoutes.includes(hash) ? hash : 'home';
  };

  const [activeRoute, setActiveRoute] = useState(getInitialRoute);

  const navigateTo = (route) => {
    setActiveRoute(route);
    window.location.hash = route;
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  useEffect(() => {
    const handleHashChange = () => {
      const hash = window.location.hash.replace('#', '');
      const validRoutes = ['home', 'calculadora', 'locais', 'solicitar', 'freteiro', 'comprovante', 'status'];
      if (validRoutes.includes(hash)) {
        setActiveRoute(hash);
      }
    };

    window.addEventListener('hashchange', handleHashChange);
    return () => window.removeEventListener('hashchange', handleHashChange);
  }, []);

  // Renderizador condicional de páginas
  const renderPage = () => {
    switch (activeRoute) {
      case 'home':
        return <Home onNavigate={navigateTo} />;
      case 'calculadora':
        return <CalculadoraPreco onNavigate={navigateTo} />;
      case 'locais':
        return <LocaisDescarte />;
      case 'solicitar':
        return <SolicitacaoColeta onNavigate={navigateTo} />;
      case 'freteiro':
        return <PainelFreteiro onNavigate={navigateTo} />;
      case 'comprovante':
        return <ComprovanteSelo />;
      case 'status':
        return <StatusSistema />;
      default:
        return <Home onNavigate={navigateTo} />;
    }
  };

  return (
    <div className="app-container">
      <BackendBanner />
      <Navbar activeRoute={activeRoute} onNavigate={navigateTo} />
      <main className="main-content">
        {renderPage()}
      </main>
      <Footer onNavigate={navigateTo} />
    </div>
  );
}
