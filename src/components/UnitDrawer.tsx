import React from "react";
import { UnidadePublica } from "../types";
import { X, ExternalLink, ShieldCheck, Building, Laptop, Users, Award, Handshake } from "lucide-react";

interface UnitDrawerProps {
  unidade: UnidadePublica | null;
  onClose: () => void;
}

export const UnitDrawer: React.FC<UnitDrawerProps> = ({ unidade, onClose }) => {
  if (!unidade) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose}>
      <aside 
        className="drawer-panel" 
        onClick={(e) => e.stopPropagation()}
        aria-label={`Perfil da unidade: ${unidade.escola_unidade}`}
      >
        {/* Header do Drawer */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", borderBottom: "1px solid #E2E8F0", paddingBottom: "1rem", marginBottom: "1.25rem" }}>
          <div>
            <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#0163AC", textTransform: "uppercase", letterSpacing: "0.05em" }}>
              {unidade.ramo} · {unidade.uf} · {unidade.sigla_orgao}
            </span>
            <h2 style={{ fontSize: "1.3rem", fontWeight: 800, color: "#00367C", marginTop: "0.25rem" }}>
              {unidade.escola_unidade}
            </h2>
            <div style={{ fontSize: "0.88rem", color: "#64748B" }}>
              {unidade.orgao}
            </div>
          </div>
          <button 
            onClick={onClose}
            style={{ background: "none", border: "none", cursor: "pointer", color: "#64748B" }}
            aria-label="Fechar painel de detalhes"
          >
            <X size={24} />
          </button>
        </div>

        {/* Disclaimer Metodológico Obrigatório (Regra 25) */}
        <div style={{ background: "#F1F5F9", borderLeft: "3px solid #00367C", padding: "0.75rem 1rem", fontSize: "0.8rem", color: "#334155", marginBottom: "1.5rem" }}>
          <strong>Aviso Metodológico:</strong> Informações autodeclaradas pela unidade no questionário do Diagnóstico Nacional (Ciclo 2025/2026), não constituindo dados auditados externamente.
        </div>

        {/* Seção 1: Identificação Institucional */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#00367C", fontSize: "0.95rem", marginBottom: "0.75rem", borderBottom: "1px solid #F1F5F9", paddingBottom: "0.3rem" }}>
            <Building size={16} /> Identificação Institucional
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.75rem", fontSize: "0.85rem" }}>
            <div><strong>Natureza:</strong><br />{unidade.natureza}</div>
            <div><strong>Ano de Criação:</strong><br />{unidade.ano_criacao || "Não informado"}</div>
            <div><strong>UF de Sede Proxy:</strong><br />{unidade.uf}</div>
            <div>
              <strong>Página Oficial:</strong><br />
              {unidade.site_escola ? (
                <a href={unidade.site_escola} target="_blank" rel="noopener noreferrer" style={{ display: "inline-flex", alignItems: "center", gap: "0.2rem" }}>
                  Acessar portal <ExternalLink size={12} />
                </a>
              ) : (
                "Não informado"
              )}
            </div>
          </div>
        </div>

        {/* Seção 2: Governança e Orçamento */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#00367C", fontSize: "0.95rem", marginBottom: "0.75rem", borderBottom: "1px solid #F1F5F9", paddingBottom: "0.3rem" }}>
            <ShieldCheck size={16} /> Governança e Arranjo Orçamentário
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
            <div><strong>Planejamento Estratégico:</strong> {unidade.planejamento}</div>
            <div><strong>Arranjo da Dotação:</strong> {unidade.dotacao}</div>
            <div><strong>Orçamento Executado (2025 autodeclarado):</strong> {unidade.orcamento_faixa}</div>
            <div><strong>Instrumentos Vigentes:</strong> {unidade.instrumentos_governanca || "Nenhum informado"}</div>
          </div>
        </div>

        {/* Seção 3: Capacidades Físicas e Pessoal */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#00367C", fontSize: "0.95rem", marginBottom: "0.75rem", borderBottom: "1px solid #F1F5F9", paddingBottom: "0.3rem" }}>
            <Building size={16} /> Estrutura Física e Quadro de Pessoal
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
            <div><strong>Estrutura Física Disponível:</strong> {unidade.estrutura_fisica || "Não informado"}</div>
            <div><strong>Servidores Efetivos:</strong> {unidade.efetivos_faixa}</div>
            <div><strong>Cargos em Comissão:</strong> {unidade.comissionados_faixa}</div>
            <div><strong>Magistrados na Gestão:</strong> {unidade.magistrados_gestao_faixa}</div>
          </div>
        </div>

        {/* Seção 4: Ecossistema Digital */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#00367C", fontSize: "0.95rem", marginBottom: "0.75rem", borderBottom: "1px solid #F1F5F9", paddingBottom: "0.3rem" }}>
            <Laptop size={16} /> Educação Digital e Tecnologias
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
            <div><strong>Ambiente Virtual (AVA):</strong> {unidade.ava} {unidade.moodle === 1 ? "(Moodle)" : ""}</div>
            <div><strong>Capacidade de Produção EaD:</strong> {unidade.capacidade_ead}</div>
            <div><strong>Recursos Tecnológicos:</strong> {unidade.recursos_tecnologias || "Não informado"}</div>
          </div>
        </div>

        {/* Seção 5: Docentes e Formadores */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#00367C", fontSize: "0.95rem", marginBottom: "0.75rem", borderBottom: "1px solid #F1F5F9", paddingBottom: "0.3rem" }}>
            <Users size={16} /> Corpo Docente e Formação de Formadores
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
            <div><strong>Banco de Talentos / Cadastro Atualizado:</strong> {unidade.cadastro_formadores}</div>
            <div><strong>Formação de Formadores:</strong> {unidade.formacao_formadores}</div>
            <div><strong>Composição do Corpo Docente:</strong> {unidade.composicao_docente || "Não informado"}</div>
          </div>
        </div>

        {/* Seção 6: Avaliação da Aprendizagem e Impacto */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#00367C", fontSize: "0.95rem", marginBottom: "0.75rem", borderBottom: "1px solid #F1F5F9", paddingBottom: "0.3rem" }}>
            <Award size={16} /> Avaliação da Formação (Kirkpatrick)
          </h4>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0.5rem", fontSize: "0.85rem" }}>
            <div><strong>Nível 1 (Reação):</strong><br />{unidade.n1_reacao}</div>
            <div><strong>Nível 2 (Aprendizagem):</strong><br />{unidade.n2_aprendizagem}</div>
            <div><strong>Nível 3 (Transferência):</strong><br />{unidade.n3_transferencia}</div>
            <div><strong>Nível 4 (Impacto):</strong><br />{unidade.n4_impacto}</div>
          </div>
          <div style={{ marginTop: "0.5rem", fontSize: "0.85rem" }}>
            <strong>Pesquisa com Egressos:</strong> {unidade.egressos}
          </div>
        </div>

        {/* Seção 7: Cooperação e Articulação ENAJU */}
        <div style={{ marginBottom: "1.5rem" }}>
          <h4 style={{ display: "flex", alignItems: "center", gap: "0.4rem", color: "#00367C", fontSize: "0.95rem", marginBottom: "0.75rem", borderBottom: "1px solid #F1F5F9", paddingBottom: "0.3rem" }}>
            <Handshake size={16} /> Cooperação e Articulação em Rede
          </h4>
          <div style={{ display: "flex", flexDirection: "column", gap: "0.5rem", fontSize: "0.85rem" }}>
            <div><strong>Parcerias Formais Vigentes:</strong> {unidade.parcerias}</div>
            <div><strong>Interesse em Ações com a ENAJU/CNJ:</strong> {unidade.interesse_enaju}</div>
            <div><strong>Modalidades de Cooperação Praticadas:</strong> {unidade.modalidades_cooperacao || "Nenhuma informada"}</div>
          </div>
        </div>

        <div style={{ marginTop: "auto", paddingTop: "1rem", borderTop: "1px solid #E2E8F0", textAlign: "right" }}>
          <button className="btn btn-primary" onClick={onClose}>
            Fechar Perfil
          </button>
        </div>
      </aside>
    </div>
  );
};
