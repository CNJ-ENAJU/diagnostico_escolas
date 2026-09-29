import React, { useState, useEffect } from "react";
import { Download, FileText, Database, ShieldCheck, CheckCircle2 } from "lucide-react";
import { Metadata, UnidadePublica } from "../types";
import { carregarMetadata, baixarCSV, gerarCSVDeObjetos } from "../services/dataService";

interface DownloadsProps {
  unidadesFiltradas: UnidadePublica[];
}

export const Downloads: React.FC<DownloadsProps> = ({ unidadesFiltradas }) => {
  const [metadata, setMetadata] = useState<Metadata | null>(null);

  useEffect(() => {
    carregarMetadata().then(setMetadata).catch(console.error);
  }, []);

  const handleBaixarFiltrado = () => {
    const csv = gerarCSVDeObjetos(unidadesFiltradas);
    const dataStr = new Date().toISOString().slice(0, 10);
    baixarCSV(csv, `dados_filtrados_enaju_${dataStr}.csv`);
  };

  const arquivos = [
    {
      nome: "diagnostico_unidades_publico.csv",
      titulo: "Base Pública das Unidades de Formação (Microdados Anonimizados)",
      descricao: "Conjunto consolidado das 110 unidades respondentes com variáveis de governança, infraestrutura, AVA, corpo docente, avaliação e cooperação (UTF-8 com BOM).",
      linhas: "110 linhas",
      formato: "CSV",
      arquivoJson: "diagnostico_unidades_publico.json"
    },
    {
      nome: "indicadores_painel_completo.csv",
      titulo: "Matriz Completa de Indicadores e Cortes (Camada Homologada)",
      descricao: "Tabela oficial idêntica ao relatório com 1.295 linhas estruturadas por variável, categoria e segmento (n, N e percentuais).",
      linhas: "1.295 linhas",
      formato: "CSV",
      arquivoJson: "indicadores_painel_completo.json"
    },
    {
      nome: "indicadores_nacionais.csv",
      titulo: "Recorte dos Indicadores Nacionais Consolidados",
      descricao: "Recorte das frequências univariadas em nível Brasil (N=110) de todas as variáveis do questionário.",
      linhas: "185 linhas",
      formato: "CSV",
      arquivoJson: "indicadores_nacionais.json"
    },
    {
      nome: "indicadores_por_ramo.csv",
      titulo: "Indicadores Desagregados pelos 6 Ramos de Justiça",
      descricao: "Comportamento de todas as variáveis nos 6 ramos do Judiciário (com salvaguarda R01.1 de números absolutos nos ramos N <= 10).",
      linhas: "1.110 linhas",
      formato: "CSV",
      arquivoJson: "indicadores_por_ramo.json"
    },
    {
      nome: "indicadores_por_uf.csv",
      titulo: "Distribuição Territorial por UF e Ramo",
      descricao: "Contagens agregadas de unidades por Unidade Federativa da sede institucional e ramo de justiça.",
      linhas: "87 linhas",
      formato: "CSV",
      arquivoJson: "territorio.json"
    },
    {
      nome: "dicionario_dados_publicos.csv",
      titulo: "Dicionário de Variáveis e Metadados das Perguntas",
      descricao: "Descrição conceitual de cada variável pública, pergunta de origem no questionário oficial e categorias de resposta válidas.",
      linhas: "31 variáveis",
      formato: "CSV",
      arquivoJson: null
    },
  ];

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#00367C", marginBottom: "0.4rem" }}>
          Central de Dados Abertos & Downloads
        </h2>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Download dos conjuntos de dados públicos homologados em formatos abertos (CSV com UTF-8 BOM e JSON) · Rastreabilidade total
        </p>
      </div>

      {/* Caixa de Download da Visão Filtrada Atual (Regra 27) */}
      <div style={{ background: "#EFF6FF", border: "1px solid #BFDBFE", borderRadius: "8px", padding: "1.25rem 1.5rem", marginBottom: "2rem", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "1rem" }}>
        <div>
          <h4 style={{ color: "#1E3A8A", fontSize: "1.05rem", fontWeight: 700, marginBottom: "0.25rem" }}>
            Exportar Visão Filtrada Atual
          </h4>
          <p style={{ fontSize: "0.85rem", color: "#3B82F6" }}>
            Baixe instantaneamente a subamostra correspondente aos filtros ativos ({unidadesFiltradas.length} unidades selecionadas).
          </p>
        </div>

        <button className="btn btn-primary" onClick={handleBaixarFiltrado}>
          <Download size={16} />
          <span>Baixar Dados Filtrados (CSV)</span>
        </button>
      </div>

      {/* Lista dos 6 Conjuntos de Dados Oficiais (Regra 26) */}
      <section style={{ marginBottom: "3rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#00367C", marginBottom: "1.25rem" }}>
          Arquivos Oficiais da Camada Pública de Dados
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          {arquivos.map((arq, idx) => (
            <div
              key={idx}
              style={{
                background: "#ffffff",
                border: "1px solid #E2E8F0",
                borderRadius: "8px",
                padding: "1.25rem",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                flexWrap: "wrap",
                gap: "1rem",
                boxShadow: "0 1px 3px 0 rgba(0,0,0,0.05)"
              }}
            >
              <div style={{ maxWidth: "720px" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem", marginBottom: "0.25rem" }}>
                  <span style={{ fontWeight: 700, color: "#00367C", fontSize: "1rem" }}>
                    {arq.titulo}
                  </span>
                  <span style={{ background: "#E8F4FB", color: "#0163AC", fontSize: "0.72rem", padding: "0.15rem 0.5rem", borderRadius: "4px", fontWeight: 600 }}>
                    {arq.linhas}
                  </span>
                </div>
                <p style={{ fontSize: "0.84rem", color: "#64748B", lineHeight: 1.4 }}>
                  {arq.descricao}
                </p>
                <div style={{ fontSize: "0.75rem", color: "#94A3B8", marginTop: "0.35rem", fontFamily: "monospace" }}>
                  Arquivo: {arq.nome}
                </div>
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <a
                  href={`./data/${arq.nome}`}
                  download={arq.nome}
                  className="btn btn-outline btn-sm"
                  style={{ textDecoration: "none" }}
                >
                  <Download size={13} />
                  <span>CSV</span>
                </a>

                {arq.arquivoJson && (
                  <a
                    href={`./data/${arq.arquivoJson}`}
                    download={arq.arquivoJson}
                    className="btn btn-outline btn-sm"
                    style={{ textDecoration: "none" }}
                  >
                    <Download size={13} />
                    <span>JSON</span>
                  </a>
                )}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Metadados e Hashes Criptográficos SHA-256 (Regra 29) */}
      <section style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "1.5rem" }}>
        <h3 style={{ fontSize: "1.1rem", fontWeight: 700, color: "#00367C", marginBottom: "0.75rem", display: "flex", alignItems: "center", gap: "0.4rem" }}>
          <ShieldCheck size={18} /> Metadados Técnicos e Integridade Criptográfica (SHA-256)
        </h3>
        <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.5, marginBottom: "1rem" }}>
          Todos os arquivos públicos gerados pelo pipeline de dados possuem assinatura hash SHA-256 para garantia de integridade, auditabilidade e não-adulteração:
        </p>

        <div style={{ background: "#ffffff", padding: "1rem", borderRadius: "6px", border: "1px solid #CBD5E1", fontSize: "0.78rem", fontFamily: "monospace", overflowX: "auto" }}>
          <pre>{JSON.stringify(metadata, null, 2)}</pre>
        </div>
      </section>
    </div>
  );
};
