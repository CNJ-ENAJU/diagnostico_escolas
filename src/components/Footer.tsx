import React from "react";
import { FONTE_OFICIAL } from "../config";

interface FooterProps {
  onNavigate: (page: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="inst-footer">
      <div className="footer-content">
        <div>
          <h4 style={{ color: "#ffffff", fontSize: "0.95rem", marginBottom: "0.75rem", fontWeight: 700 }}>
            Escola Nacional do Judiciário (ENAJU)
          </h4>
          <p style={{ lineHeight: 1.5, fontSize: "0.82rem", color: "#94A3B8" }}>
            Criada pela Resolução CNJ nº 643/2025 com a missão de articular, qualificar e integrar a rede de unidades de formação e aperfeiçoamento de magistrados e servidores do Poder Judiciário brasileiro.
          </p>
        </div>

        <div>
          <h4 style={{ color: "#ffffff", fontSize: "0.95rem", marginBottom: "0.75rem", fontWeight: 700 }}>
            Navegação Institucional
          </h4>
          <ul style={{ listStyle: "none", display: "flex", flexDirection: "column", gap: "0.4rem", fontSize: "0.82rem" }}>
            <li><button onClick={() => onNavigate("inicio")} style={{ background: "none", border: "none", color: "#93C5FD", cursor: "pointer", padding: 0 }}>Página Inicial</button></li>
            <li><button onClick={() => onNavigate("visao-geral")} style={{ background: "none", border: "none", color: "#93C5FD", cursor: "pointer", padding: 0 }}>Achados e Síntese</button></li>
            <li><button onClick={() => onNavigate("rede-nacional")} style={{ background: "none", border: "none", color: "#93C5FD", cursor: "pointer", padding: 0 }}>Mapa e Rede Territorial</button></li>
            <li><button onClick={() => onNavigate("escolas")} style={{ background: "none", border: "none", color: "#93C5FD", cursor: "pointer", padding: 0 }}>Consulta às Unidades</button></li>
            <li><button onClick={() => onNavigate("metodologia")} style={{ background: "none", border: "none", color: "#93C5FD", cursor: "pointer", padding: 0 }}>Metodologia e Salvaguardas</button></li>
            <li><button onClick={() => onNavigate("dados")} style={{ background: "none", border: "none", color: "#93C5FD", cursor: "pointer", padding: 0 }}>Central de Dados Abertos</button></li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: "#ffffff", fontSize: "0.95rem", marginBottom: "0.75rem", fontWeight: 700 }}>
            Transparência e Governança
          </h4>
          <p style={{ fontSize: "0.82rem", color: "#94A3B8", lineHeight: 1.5, marginBottom: "0.5rem" }}>
            {FONTE_OFICIAL}
          </p>
          <div style={{ fontSize: "0.78rem", color: "#64748B" }}>
            Aplicação em conformidade estrita com a LGPD e a Salvaguarda Metodológica R01.1 de Pequenos Grupos.
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <div>
          <strong>ENAJU · Conselho Nacional de Justiça</strong> | Diagnóstico Nacional das Unidades de Formação
        </div>
        <div>
          Versão dos dados: <strong>1.0.0</strong> · Atualização: <strong>29/09/2026</strong>
        </div>
      </div>
    </footer>
  );
};
