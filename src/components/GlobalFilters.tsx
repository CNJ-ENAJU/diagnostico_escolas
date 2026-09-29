import React, { useMemo } from "react";
import { FiltrosGlobaisState, UnidadePublica } from "../types";
import { SEG_ORDEM, ROTULOS_RAMO } from "../config";
import { RotateCcw, Share2, Download, Search } from "lucide-react";
import { baixarCSV, gerarCSVDeObjetos } from "../services/dataService";

interface GlobalFiltersProps {
  filtros: FiltrosGlobaisState;
  onChange: (novosFiltros: FiltrosGlobaisState) => void;
  unidadesTotais: UnidadePublica[];
  unidadesFiltradas: UnidadePublica[];
}

export const GlobalFilters: React.FC<GlobalFiltersProps> = ({
  filtros,
  onChange,
  unidadesTotais,
  unidadesFiltradas,
}) => {
  // Obter listas únicas para selects
  const ufsDisponiveis = useMemo(() => {
    const setUfs = new Set(unidadesTotais.map((u) => u.uf));
    return Array.from(setUfs).sort();
  }, [unidadesTotais]);

  const orgaosDisponiveis = useMemo(() => {
    const mapOrgaos = new Map<string, string>();
    unidadesTotais.forEach((u) => {
      if (!filtros.ramo || u.ramo === filtros.ramo) {
        mapOrgaos.set(u.sigla_orgao, `${u.sigla_orgao} — ${u.orgao}`);
      }
    });
    return Array.from(mapOrgaos.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [unidadesTotais, filtros.ramo]);

  const naturezasDisponiveis = useMemo(() => {
    const setNat = new Set(unidadesTotais.map((u) => u.natureza));
    return Array.from(setNat).sort();
  }, [unidadesTotais]);

  const handleLimpar = () => {
    const limpo: FiltrosGlobaisState = {
      ramo: "",
      uf: "",
      orgao: "",
      natureza: "",
      busca: "",
    };
    onChange(limpo);
  };

  const handleCompartilhar = () => {
    const params = new URLSearchParams();
    if (filtros.ramo) params.set("ramo", filtros.ramo);
    if (filtros.uf) params.set("uf", filtros.uf);
    if (filtros.orgao) params.set("orgao", filtros.orgao);
    if (filtros.natureza) params.set("natureza", filtros.natureza);
    if (filtros.busca) params.set("busca", filtros.busca);

    const hash = window.location.hash.split("?")[0] || "#/visao-geral";
    const queryString = params.toString() ? `?${params.toString()}` : "";
    const url = `${window.location.origin}${window.location.pathname}${hash}${queryString}`;

    navigator.clipboard.writeText(url);
    alert("Link com os filtros atuais copiado para a área de transferência!");
  };

  const handleBaixarVisao = () => {
    if (unidadesFiltradas.length === 0) return;
    const csv = gerarCSVDeObjetos(unidadesFiltradas);
    const dataStr = new Date().toISOString().slice(0, 10);
    baixarCSV(csv, `dados_filtrados_enaju_${dataStr}.csv`);
  };

  const temFiltroAtivo = Boolean(
    filtros.ramo || filtros.uf || filtros.orgao || filtros.natureza || filtros.busca
  );

  return (
    <div className="filter-bar">
      <div className="filter-grid">
        {/* Ramo de Justiça */}
        <div className="filter-item">
          <label className="filter-label" htmlFor="filter-ramo">Ramo de Justiça</label>
          <select
            id="filter-ramo"
            className="filter-select"
            value={filtros.ramo}
            onChange={(e) => onChange({ ...filtros, ramo: e.target.value, orgao: "" })}
          >
            <option value="">Todos os Ramos (N = 110)</option>
            {SEG_ORDEM.map((ramo) => (
              <option key={ramo} value={ramo}>
                {ROTULOS_RAMO[ramo]}
              </option>
            ))}
          </select>
        </div>

        {/* UF */}
        <div className="filter-item">
          <label className="filter-label" htmlFor="filter-uf">Unidade da Federação (UF)</label>
          <select
            id="filter-uf"
            className="filter-select"
            value={filtros.uf}
            onChange={(e) => onChange({ ...filtros, uf: e.target.value })}
          >
            <option value="">Todas as UFs (27 UFs)</option>
            {ufsDisponiveis.map((uf) => (
              <option key={uf} value={uf}>
                {uf}
              </option>
            ))}
          </select>
        </div>

        {/* Órgão */}
        <div className="filter-item">
          <label className="filter-label" htmlFor="filter-orgao">Tribunal / Órgão</label>
          <select
            id="filter-orgao"
            className="filter-select"
            value={filtros.orgao}
            onChange={(e) => onChange({ ...filtros, orgao: e.target.value })}
          >
            <option value="">Todos os Órgãos (92 órgãos)</option>
            {orgaosDisponiveis.map(([sigla, rotulo]) => (
              <option key={sigla} value={sigla}>
                {rotulo}
              </option>
            ))}
          </select>
        </div>

        {/* Natureza */}
        <div className="filter-item">
          <label className="filter-label" htmlFor="filter-natureza">Natureza Institucional</label>
          <select
            id="filter-natureza"
            className="filter-select"
            value={filtros.natureza}
            onChange={(e) => onChange({ ...filtros, natureza: e.target.value })}
          >
            <option value="">Todas as Naturezas</option>
            {naturezasDisponiveis.map((nat) => (
              <option key={nat} value={nat}>
                {nat}
              </option>
            ))}
          </select>
        </div>

        {/* Busca por texto */}
        <div className="filter-item">
          <label className="filter-label" htmlFor="filter-busca">Pesquisar Unidade / Órgão</label>
          <div style={{ position: "relative" }}>
            <input
              id="filter-busca"
              type="text"
              className="filter-input"
              placeholder="Digite o nome ou sigla..."
              value={filtros.busca}
              onChange={(e) => onChange({ ...filtros, busca: e.target.value })}
              style={{ paddingLeft: "2rem" }}
            />
            <Search 
              size={14} 
              style={{ position: "absolute", left: "0.6rem", top: "50%", transform: "translateY(-50%)", color: "#94A3B8" }} 
            />
          </div>
        </div>
      </div>

      {/* Status e Ações */}
      <div className="filter-status">
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span>Amostra filtrada:</span>
          <span className="filter-count">
            N = {unidadesFiltradas.length} unidades ({((100 * unidadesFiltradas.length) / unidadesTotais.length).toFixed(1)}% do universo)
          </span>
          {temFiltroAtivo && (
            <span style={{ fontSize: "0.75rem", color: "#64748B" }}>
              (Filtros ativos aplicados)
            </span>
          )}
        </div>

        <div style={{ display: "flex", gap: "0.5rem" }}>
          {temFiltroAtivo && (
            <button className="btn btn-outline btn-sm" onClick={handleLimpar} title="Limpar todos os filtros">
              <RotateCcw size={13} />
              <span>Limpar filtros</span>
            </button>
          )}

          <button className="btn btn-outline btn-sm" onClick={handleCompartilhar} title="Copiar link com filtros atuais">
            <Share2 size={13} />
            <span>Compartilhar visão</span>
          </button>

          <button className="btn btn-primary btn-sm" onClick={handleBaixarVisao} title="Baixar microdados filtrados em CSV">
            <Download size={13} />
            <span>Baixar visão (CSV)</span>
          </button>
        </div>
      </div>
    </div>
  );
};
