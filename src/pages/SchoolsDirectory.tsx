import React, { useState } from "react";
import { UnidadePublica } from "../types";
import { UnitDrawer } from "../components/UnitDrawer";
import { Search, Eye, Download, ExternalLink } from "lucide-react";
import { baixarCSV, gerarCSVDeObjetos } from "../services/dataService";

interface SchoolsDirectoryProps {
  unidades: UnidadePublica[];
}

export const SchoolsDirectory: React.FC<SchoolsDirectoryProps> = ({ unidades }) => {
  const [buscaLocal, setBuscaLocal] = useState("");
  const [pagina, setPagina] = useState(1);
  const [unidadeSelecionada, setUnidadeSelecionada] = useState<UnidadePublica | null>(null);
  const itensPorPagina = 15;

  const unidadesFiltradas = React.useMemo(() => {
    if (!buscaLocal) return unidades;
    const q = buscaLocal.toLowerCase();
    return unidades.filter(
      (u) =>
        u.escola_unidade.toLowerCase().includes(q) ||
        u.orgao.toLowerCase().includes(q) ||
        u.sigla_orgao.toLowerCase().includes(q) ||
        u.uf.toLowerCase().includes(q) ||
        u.ramo.toLowerCase().includes(q) ||
        u.natureza.toLowerCase().includes(q)
    );
  }, [unidades, buscaLocal]);

  const totalPaginas = Math.ceil(unidadesFiltradas.length / itensPorPagina) || 1;
  const unidadesPaginadas = unidadesFiltradas.slice(
    (pagina - 1) * itensPorPagina,
    pagina * itensPorPagina
  );

  const handleBaixarTabela = () => {
    const csv = gerarCSVDeObjetos(unidadesFiltradas);
    baixarCSV(csv, "diretorio_unidades_publico.csv");
  };

  return (
    <div>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", flexWrap: "wrap", gap: "1rem", marginBottom: "2rem" }}>
        <div>
          <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#00367C", marginBottom: "0.4rem" }}>
            Diretório Público de Unidades de Formação
          </h2>
          <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
            Consulta pública às 110 unidades respondentes · Filtros descritivos sem qualquer finalidade de ranqueamento institucional
          </p>
        </div>

        <button className="btn btn-outline" onClick={handleBaixarTabela}>
          <Download size={15} />
          <span>Baixar Diretório (CSV)</span>
        </button>
      </div>

      {/* Caixa de Busca Local */}
      <div style={{ position: "relative", marginBottom: "1.5rem", maxWidth: "450px" }}>
        <input
          type="text"
          className="filter-input"
          placeholder="Buscar por tribunal, escola, UF ou ramo..."
          value={buscaLocal}
          onChange={(e) => {
            setBuscaLocal(e.target.value);
            setPagina(1);
          }}
          style={{ paddingLeft: "2.2rem" }}
        />
        <Search
          size={16}
          style={{ position: "absolute", left: "0.75rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }}
        />
      </div>

      {/* Tabela de Consulta */}
      <div className="table-container">
        <table className="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Escola / Unidade de Formação</th>
              <th>Tribunal / Órgão</th>
              <th>UF</th>
              <th>Ramo</th>
              <th>Natureza</th>
              <th>Criação</th>
              <th style={{ textAlign: "center" }}>Perfil Completo</th>
            </tr>
          </thead>
          <tbody>
            {unidadesPaginadas.map((u) => (
              <tr key={u.id_unidade} style={{ cursor: "pointer" }} onClick={() => setUnidadeSelecionada(u)}>
                <td style={{ fontWeight: 600, color: "#64748B" }}>{u.id_unidade}</td>
                <td style={{ fontWeight: 600, color: "#00367C" }}>{u.escola_unidade}</td>
                <td>{u.sigla_orgao}</td>
                <td><span style={{ background: "#F1F5F9", padding: "0.15rem 0.4rem", borderRadius: "3px", fontWeight: 600 }}>{u.uf}</span></td>
                <td>{u.ramo}</td>
                <td style={{ fontSize: "0.8rem", color: "#475569" }}>{u.natureza}</td>
                <td>{u.ano_criacao || "—"}</td>
                <td style={{ textAlign: "center" }}>
                  <button
                    className="btn btn-outline btn-sm"
                    onClick={(e) => {
                      e.stopPropagation();
                      setUnidadeSelecionada(u);
                    }}
                    title="Ver perfil institucional declarado"
                    aria-label={`Ver perfil de ${u.escola_unidade}`}
                  >
                    <Eye size={13} />
                    <span>Ver Perfil</span>
                  </button>
                </td>
              </tr>
            ))}
            {unidadesPaginadas.length === 0 && (
              <tr>
                <td colSpan={8} style={{ textAlign: "center", padding: "2rem", color: "#64748B" }}>
                  Nenhuma unidade encontrada com os termos informados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Paginação */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: "0.85rem", color: "#64748B" }}>
        <span>
          Mostrando {Math.min((pagina - 1) * itensPorPagina + 1, unidadesFiltradas.length)} a {Math.min(pagina * itensPorPagina, unidadesFiltradas.length)} de {unidadesFiltradas.length} unidades
        </span>

        <div style={{ display: "flex", gap: "0.4rem" }}>
          <button
            className="btn btn-outline btn-sm"
            disabled={pagina <= 1}
            onClick={() => setPagina(pagina - 1)}
          >
            Anterior
          </button>
          <span style={{ display: "flex", alignItems: "center", padding: "0 0.5rem", fontWeight: 600 }}>
            {pagina} / {totalPaginas}
          </span>
          <button
            className="btn btn-outline btn-sm"
            disabled={pagina >= totalPaginas}
            onClick={() => setPagina(pagina + 1)}
          >
            Próxima
          </button>
        </div>
      </div>

      {/* Drawer de Perfil Institucional Declarado */}
      <UnitDrawer
        unidade={unidadeSelecionada}
        onClose={() => setUnidadeSelecionada(null)}
      />
    </div>
  );
};
