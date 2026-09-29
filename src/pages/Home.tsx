import React from "react";
import { ArrowRight, BarChart3, Database, ShieldCheck, MapPin, School, BookOpen } from "lucide-react";
import { UnidadePublica } from "../types";

interface HomeProps {
  onNavigate: (page: string) => void;
  unidades: UnidadePublica[];
}

export const Home: React.FC<HomeProps> = ({ onNavigate, unidades }) => {
  const nTotal = unidades.length || 110;
  const nOrgaos = new Set(unidades.map(u => u.sigla_orgao)).size || 92;
  const nEscolas = unidades.filter(u => u.natureza === "Escola formalmente instituída").length || 86;
  const nSetores = unidades.filter(u => u.natureza === "Setor de capacitação (gestão de pessoas)").length || 17;
  const nCentros = unidades.filter(u => u.natureza === "Centro/núcleo sem natureza de escola").length || 7;

  return (
    <div>
      {/* Hero Banner Editorial */}
      <section style={{ 
        background: "linear-gradient(135deg, #00224f 0%, #00367C 60%, #0163AC 100%)", 
        color: "#ffffff", 
        padding: "3.5rem 2rem", 
        borderRadius: "12px", 
        marginBottom: "2.5rem",
        boxShadow: "0 10px 25px -5px rgba(0, 54, 124, 0.2)"
      }}>
        <div style={{ maxWidth: "850px" }}>
          <div style={{ 
            display: "inline-block", 
            background: "rgba(255, 255, 255, 0.15)", 
            padding: "0.25rem 0.75rem", 
            borderRadius: "4px", 
            fontSize: "0.8rem", 
            fontWeight: 600,
            letterSpacing: "0.05em",
            marginBottom: "1rem"
          }}>
            ESCOLA NACIONAL DO JUDICIÁRIO · CONSELHO NACIONAL DE JUSTIÇA
          </div>
          <h1 style={{ fontSize: "2.4rem", fontWeight: 800, lineHeight: 1.15, marginBottom: "1rem" }}>
            Diagnóstico Nacional das Unidades de Formação do Poder Judiciário
          </h1>
          <p style={{ fontSize: "1.1rem", opacity: 0.9, lineHeight: 1.6, marginBottom: "2rem" }}>
            Painel público e auditável de indicadores institucionais, educacionais e tecnológicos das unidades de capacitação da magistratura e de servidores da Justiça brasileira (Resolução CNJ nº 643/2025).
          </p>

          {/* Dois Caminhos Claros da Página Inicial (Regra 49) */}
          <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
            <button 
              className="btn" 
              onClick={() => onNavigate("visao-geral")}
              style={{ background: "#009BD4", color: "#ffffff", padding: "0.75rem 1.5rem", fontSize: "0.95rem" }}
            >
              <BarChart3 size={18} />
              <span>Conheça o Diagnóstico (Achados Centrais)</span>
              <ArrowRight size={16} />
            </button>

            <button 
              className="btn btn-outline" 
              onClick={() => onNavigate("rede-nacional")}
              style={{ background: "#ffffff", color: "#00367C", borderColor: "#ffffff", padding: "0.75rem 1.5rem", fontSize: "0.95rem" }}
            >
              <MapPin size={18} />
              <span>Explore a Rede Nacional e o Mapa</span>
            </button>
          </div>
        </div>
      </section>

      {/* Cartões Executivos Principais (Regra 10) */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#00367C", marginBottom: "1.25rem" }}>
          Universo Institucional Representado
        </h2>
        
        <div className="card-grid">
          <div className="metric-card">
            <div className="metric-header">Unidades Respondentes</div>
            <div className="metric-val">{nTotal}</div>
            <div className="metric-desc">Unidades primárias de formação mapeadas em todo o território nacional.</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">Órgãos Judiciais</div>
            <div className="metric-val">{nOrgaos}</div>
            <div className="metric-desc">90 tribunais do escopo (de 91 = 98,9%), além do CJF e do CSJT.</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">Escolas Instituídas</div>
            <div className="metric-val">{nEscolas}</div>
            <div className="metric-desc">78,2% constituídas com natureza formal de Escola Judicial.</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">Setores de Capacitação</div>
            <div className="metric-val">{nSetores}</div>
            <div className="metric-desc">15,5% vinculados organicamente a diretorias de Recursos Humanos/GP.</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">Centros / Núcleos</div>
            <div className="metric-val">{nCentros}</div>
            <div className="metric-desc">6,4% operam sob arranjo de centro ou núcleo especializado.</div>
          </div>

          <div className="metric-card">
            <div className="metric-header">Interesse em Rede</div>
            <div className="metric-val" style={{ color: "#2E7D32" }}>99,1%</div>
            <div className="metric-desc">Disposição positiva (76,4% alto, 22,7% moderado) para integração à ENAJU.</div>
          </div>
        </div>
      </section>

      {/* Dimensões do Painel */}
      <section style={{ marginBottom: "3rem" }}>
        <h2 style={{ fontSize: "1.25rem", fontWeight: 700, color: "#00367C", marginBottom: "1.25rem" }}>
          Dimensões Estratégicas do Diagnóstico
        </h2>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "1.25rem" }}>
          <div 
            className="finding-box" 
            style={{ cursor: "pointer", transition: "transform 0.15s ease" }}
            onClick={() => onNavigate("governanca")}
          >
            <div className="finding-title"><ShieldCheck size={18} /> Governança e Planejamento</div>
            <div className="finding-body">
              Análise comparativa entre o Indicador A (47,3% planejamento próprio) e Indicador B (68,2%), normativos e colegiados.
            </div>
          </div>

          <div 
            className="finding-box" 
            style={{ cursor: "pointer", transition: "transform 0.15s ease" }}
            onClick={() => onNavigate("educacao-digital")}
          >
            <div className="finding-title"><Database size={18} /> Ecossistema Digital</div>
            <div className="finding-body">
              Presença de plataformas AVA (95,5%), liderança do Moodle (90,0%) e capacidade de produção e gestão em EaD.
            </div>
          </div>

          <div 
            className="finding-box" 
            style={{ cursor: "pointer", transition: "transform 0.15s ease" }}
            onClick={() => onNavigate("avaliacao")}
          >
            <div className="finding-title"><BarChart3 size={18} /> Avaliação da Formação</div>
            <div className="finding-body">
              A Escada de Kirkpatrick: do Nível 1 Reação (97,3%) aos Níveis 3 e 4 de Transferência e Impacto Organizacional.
            </div>
          </div>

          <div 
            className="finding-box" 
            style={{ cursor: "pointer", transition: "transform 0.15s ease" }}
            onClick={() => onNavigate("escolas")}
          >
            <div className="finding-title"><School size={18} /> Diretório Público de Unidades</div>
            <div className="finding-body">
              Consulta aberta e perfil público de cada uma das 110 unidades respondentes sem exposição de dados pessoais.
            </div>
          </div>

          <div 
            className="finding-box" 
            style={{ cursor: "pointer", transition: "transform 0.15s ease" }}
            onClick={() => onNavigate("metodologia")}
          >
            <div className="finding-title"><BookOpen size={18} /> Metodologia e Salvaguardas</div>
            <div className="finding-body">
              Decisões C02, rastreabilidade de denominadores, proteção a pequenos grupos (R01.1) e teste de sensibilidade R110.
            </div>
          </div>

          <div 
            className="finding-box" 
            style={{ cursor: "pointer", transition: "transform 0.15s ease" }}
            onClick={() => onNavigate("dados")}
          >
            <div className="finding-title"><Database size={18} /> Dados Abertos e Downloads</div>
            <div className="finding-body">
              Download das bases em CSV e JSON com UTF-8 BOM, dicionário de variáveis e metadados com hashes SHA-256.
            </div>
          </div>
        </div>
      </section>

      {/* Nota Metodológica Obrigatória */}
      <section style={{ background: "#F1F5F9", padding: "1.25rem 1.5rem", borderRadius: "8px", border: "1px solid #E2E8F0" }}>
        <h4 style={{ color: "#00367C", fontSize: "0.95rem", marginBottom: "0.4rem", fontWeight: 700 }}>
          Salvaguarda Metodológica e Rastreabilidade Científica
        </h4>
        <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.5 }}>
          O painel consome rigorosamente a mesma camada analítica homologada no Relatório Oficial do Diagnóstico Nacional. Conforme a regra R01.1, subgrupos com N ≤ 10 têm resultados reportados em valores absolutos ou suprimidos em cruzamentos multidimensionais para resguardar a confidencialidade institucional das unidades.
        </p>
      </section>
    </div>
  );
};
