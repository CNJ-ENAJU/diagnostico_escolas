import React, { useState } from "react";
import { 
  BarChart3, 
  Map, 
  Shield, 
  Building2, 
  Monitor, 
  GraduationCap, 
  CheckCircle2, 
  Calendar, 
  Users2, 
  School, 
  Download, 
  BookOpen, 
  Info,
  Menu,
  X
} from "lucide-react";

interface NavbarProps {
  currentPage: string;
  onPageChange: (page: string) => void;
}

export const NAV_ITEMS = [
  { id: "inicio", label: "Início", icon: Info },
  { id: "visao-geral", label: "Visão Geral", icon: BarChart3 },
  { id: "rede-nacional", label: "Rede Nacional", icon: Map },
  { id: "governanca", label: "Governança", icon: Shield },
  { id: "capacidades", label: "Capacidades", icon: Building2 },
  { id: "educacao-digital", label: "Educação Digital", icon: Monitor },
  { id: "formadores", label: "Formadores", icon: GraduationCap },
  { id: "avaliacao", label: "Avaliação", icon: CheckCircle2 },
  { id: "agenda-formativa", label: "Agenda Formativa", icon: Calendar },
  { id: "cooperacao", label: "Cooperação", icon: Users2 },
  { id: "escolas", label: "Escolas", icon: School },
  { id: "dados", label: "Dados", icon: Download },
  { id: "metodologia", label: "Metodologia", icon: BookOpen },
  { id: "sobre", label: "Sobre", icon: Info },
];

export const Navbar: React.FC<NavbarProps> = ({ currentPage, onPageChange }) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (pageId: string) => {
    onPageChange(pageId);
    setMobileMenuOpen(false);
    window.location.hash = pageId;
  };

  return (
    <>
      {/* Top Institutional Header */}
      <header className="inst-header">
        <div className="inst-header-content">
          <div className="inst-logos">
            <span>CONSELHO NACIONAL DE JUSTIÇA</span>
            <span>·</span>
            <span>ESCOLA NACIONAL DO JUDICIÁRIO (ENAJU)</span>
          </div>
          <div className="inst-badge">
            Resolução CNJ nº 643/2025 · Ciclo 2025/2026
          </div>
        </div>
      </header>

      {/* Main Persistent Navbar */}
      <nav className="navbar">
        <div className="navbar-inner">
          <div className="nav-brand" style={{ cursor: "pointer" }} onClick={() => handleNavClick("inicio")}>
            <span className="nav-title">Diagnóstico Nacional das Unidades de Formação</span>
            <span className="nav-subtitle">Painel Público de Indicadores do Poder Judiciário</span>
          </div>

          {/* Desktop Links */}
          <ul className="nav-links" style={{ display: "none" }} id="desktop-nav">
            {NAV_ITEMS.map((item) => {
              const Icon = item.icon;
              const isActive = currentPage === item.id;
              return (
                <li key={item.id}>
                  <button
                    className={`nav-link ${isActive ? "active" : ""}`}
                    onClick={() => handleNavClick(item.id)}
                    aria-label={item.label}
                  >
                    <Icon size={15} />
                    <span>{item.label}</span>
                  </button>
                </li>
              );
            })}
          </ul>

          {/* Mobile Menu Button */}
          <button 
            className="btn btn-outline btn-sm mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Abrir menu de navegação"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            <span>Menu</span>
          </button>
        </div>

        {/* Mobile Dropdown */}
        {mobileMenuOpen && (
          <div className="mobile-dropdown" style={{ background: "#fff", borderTop: "1px solid #E2E8F0", padding: "1rem" }}>
            <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.5rem" }}>
              {NAV_ITEMS.map((item) => {
                const Icon = item.icon;
                const isActive = currentPage === item.id;
                return (
                  <li key={item.id}>
                    <button
                      className={`nav-link ${isActive ? "active" : ""}`}
                      style={{ width: "100%", justifyContent: "flex-start" }}
                      onClick={() => handleNavClick(item.id)}
                    >
                      <Icon size={16} />
                      <span>{item.label}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        )}
      </nav>
      
      <style>{`
        @media (min-width: 1024px) {
          #desktop-nav {
            display: flex !important;
          }
          .mobile-menu-btn {
            display: none !important;
          }
        }
      `}</style>
    </>
  );
};
