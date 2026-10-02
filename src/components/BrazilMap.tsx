import React, { useMemo, useState } from "react";
import { GeoUF, UnidadePublica } from "../types";
import { CORES_RAMO, SEG_ORDEM } from "../config";
import { MAP_HEIGHT, MAP_WIDTH, projectBrazil, UF_PATHS } from "../data/brazilUfPaths";
import { Download } from "lucide-react";
import { baixarCSV, gerarCSVDeObjetos } from "../services/dataService";

interface BrazilMapProps {
  geoUfs: GeoUF[];
  unidadesFiltradas: UnidadePublica[];
  ufSelecionada: string;
  onSelectUf: (uf: string) => void;
}

type UFCount = { total: number; ramos: Record<string, number>; orgaos: Set<string> };

// Deslocamentos exclusivamente gráficos dos marcadores (em pixels SVG).
// As linhas-guia preservam a posição real de cada sede proxy e reduzem
// colisões em estados pequenos. NÃO representam novas coordenadas geográficas.
const LABEL_OFFSET: Record<string, [number, number]> = {
  CE: [2, -12],
  RN: [25, -17],
  PB: [29, -3],
  PE: [25, 10],
  AL: [33, 22],
  SE: [17, 32],
  PI: [-14, -4],
  DF: [18, 17],
  GO: [-15, -13],
  RJ: [13, 7],
  ES: [14, -6],
};

const RAMO_CURTO: Record<string, string> = {
  Eleitoral: "Eleitoral",
  Estadual: "Estadual",
  Trabalho: "Trabalho",
  Federal: "Federal",
  Militar: "Militar",
  "Superior/Conselho": "Superiores/Conselhos",
};

export const BrazilMap: React.FC<BrazilMapProps> = ({
  geoUfs,
  unidadesFiltradas,
  ufSelecionada,
  onSelectUf,
}) => {
  const [hoveredUf, setHoveredUf] = useState<GeoUF | null>(null);
  const [modoPercentual, setModoPercentual] = useState(false);

  const geoIndex = useMemo(() => new Map(geoUfs.map(g => [g.uf, g])), [geoUfs]);

  const contagemFiltrada = useMemo(() => {
    const m = new Map<string, UFCount>();
    for (const u of unidadesFiltradas) {
      if (!m.has(u.uf)) m.set(u.uf, { total: 0, ramos: {}, orgaos: new Set<string>() });
      const entry = m.get(u.uf)!;
      entry.total += 1;
      entry.ramos[u.ramo] = (entry.ramos[u.ramo] || 0) + 1;
      entry.orgaos.add(u.sigla_orgao);
    }
    return m;
  }, [unidadesFiltradas]);

  const ufsOrdenadas = useMemo(() =>
    [...geoUfs].sort((a, b) =>
      (contagemFiltrada.get(b.uf)?.total || 0) - (contagemFiltrada.get(a.uf)?.total || 0) ||
      a.uf.localeCompare(b.uf)
    ), [geoUfs, contagemFiltrada]
  );

  const maxUf = Math.max(1, ...ufsOrdenadas.map(g => contagemFiltrada.get(g.uf)?.total || 0));
  const totalAtual = unidadesFiltradas.length;

  const baixarTerritorio = () => {
    const linhas = ufsOrdenadas.map(g => {
      const c = contagemFiltrada.get(g.uf);
      const porRamo = Object.fromEntries(SEG_ORDEM.map(r => [r, c?.ramos[r] || 0]));
      return {
        uf: g.uf, estado: g.nome, regiao: g.regiao,
        unidades_total: c?.total || 0, orgaos_no_recorte: c?.orgaos.size || 0,
        ...porRamo,
      };
    });
    baixarCSV(gerarCSVDeObjetos(linhas), "rede_nacional_uf_ramo_recorte.csv");
  };

  const marcar = (g: GeoUF, total: number) => {
    const anchor = projectBrazil(g.lon, g.lat);
    const [dx, dy] = LABEL_OFFSET[g.uf] || [0, 0];
    const x = anchor.x + dx;
    const y = anchor.y + dy;
    const r = 7 + 2 * Math.sqrt(Math.max(total, 0));
    return { ...anchor, x, y, r, displaced: dx !== 0 || dy !== 0 };
  };

  return (
    <div style={{
      display: "grid",
      gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 420px), 1fr))",
      gap: "1.25rem",
      marginBottom: "1.5rem",
      alignItems: "stretch",
    }}>
      <section className="chart-card" aria-label="Mapa das unidades respondentes por UF de sede proxy">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Mapa das unidades por UF</h3>
            <p className="chart-subtitle">
              Contornos reais das UFs · tamanho da bolha = unidades no recorte
            </p>
          </div>
          {ufSelecionada && (
            <button className="btn btn-outline btn-sm" onClick={() => onSelectUf("")}>
              Limpar {ufSelecionada}
            </button>
          )}
        </div>

        <div style={{ display: "flex", justifyContent: "center" }}>
          <svg
            viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
            width="100%"
            role="img"
            aria-label="Brasil com contornos reais das 27 Unidades da Federação e bolhas proporcionais às unidades respondentes"
            style={{ maxWidth: "560px", height: "auto", overflow: "visible" }}
          >
            <g aria-label="Limites estaduais da cartografia do IBGE">
              {UF_PATHS.map(feature => {
                const count = contagemFiltrada.get(feature.uf)?.total || 0;
                const selected = ufSelecionada === feature.uf;
                return (
                  <path
                    key={feature.uf}
                    d={feature.path}
                    fill={selected ? "#cfe5f8" : count > 0 ? "#edf4fa" : "#f7f9fb"}
                    stroke={selected ? "#0163AC" : "#a9bed0"}
                    strokeWidth={selected ? 1.7 : 0.85}
                    fillRule="evenodd"
                  >
                    <title>{geoIndex.get(feature.uf)?.nome || feature.uf} · {count} unidade(s) no recorte</title>
                  </path>
                );
              })}
            </g>
            <g aria-label="Bolhas com os totais por UF">
              {geoUfs.map(g => {
                const count = contagemFiltrada.get(g.uf)?.total || 0;
                if (count === 0) return null;
                const pt = marcar(g, count);
                const selected = ufSelecionada === g.uf;
                const title = `${g.nome}: ${count} unidade(s) respondente(s). Clique para filtrar.`;
                return (
                  <g
                    key={g.uf}
                    role="button"
                    tabIndex={0}
                    aria-label={title}
                    style={{ cursor: "pointer" }}
                    onClick={() => { setHoveredUf(g); onSelectUf(selected ? "" : g.uf); }}
                    onKeyDown={e => {
                      if (e.key === "Enter" || e.key === " ") {
                        e.preventDefault();
                        setHoveredUf(g);
                        onSelectUf(selected ? "" : g.uf);
                      }
                    }}
                    onMouseEnter={() => setHoveredUf(g)}
                    onMouseLeave={() => setHoveredUf(null)}
                    onFocus={() => setHoveredUf(g)}
                  >
                    {pt.displaced && (
                      <line
                        x1={pt.anchor.x} y1={pt.anchor.y} x2={pt.x} y2={pt.y}
                        stroke="#64748B" strokeWidth={0.9} strokeDasharray="2 2"
                        pointerEvents="none"
                      />
                    )}
                    <circle
                      cx={pt.x} cy={pt.y} r={pt.r + (selected ? 3.5 : 1.5)}
                      fill={selected ? "#D9982B" : "#ffffff"}
                      stroke={selected ? "#D9982B" : "#ffffff"}
                      strokeWidth={1}
                    />
                    <circle
                      cx={pt.x} cy={pt.y} r={pt.r}
                      fill="#0163AC" stroke="#ffffff" strokeWidth={1.2}
                    />
                    <text
                      x={pt.x} y={pt.y + 3.5}
                      fill="white" textAnchor="middle" fontSize={10}
                      fontWeight={700} pointerEvents="none"
                    >{count}</text>
                    <text
                      x={pt.x} y={pt.y + pt.r + 11}
                      fill="#00367C" textAnchor="middle" fontSize={10}
                      fontWeight={700} pointerEvents="none"
                      stroke="#ffffff" strokeWidth={2.4} paintOrder="stroke"
                    >{g.uf}</text>
                    <title>{title}</title>
                  </g>
                );
              })}
            </g>
          </svg>
        </div>

        <div style={{
          border: "1px solid #d9e5f0", borderRadius: "6px", padding: "0.6rem 0.75rem",
          fontSize: "0.8rem", color: "#334155", minHeight: "76px", background: "#f8fafc",
        }} aria-live="polite">
          {hoveredUf ? (() => {
            const c = contagemFiltrada.get(hoveredUf.uf);
            const ramos = SEG_ORDEM.filter(r => (c?.ramos[r] || 0) > 0)
              .map(r => `${RAMO_CURTO[r]} ${c!.ramos[r]}`).join(" · ");
            return (
              <>
                <strong>{hoveredUf.nome} ({hoveredUf.uf})</strong>
                <div>{c?.total || 0} unidades · {c?.orgaos.size || 0} órgãos no recorte</div>
                <div>{ramos || "Sem unidades neste recorte"}</div>
              </>
            );
          })() : (
            <>Passe o mouse ou selecione uma bolha para consultar as unidades por ramo.
              A posição corresponde à <strong>UF de sede proxy</strong>, não ao local de realização dos cursos.</>
          )}
        </div>

        <div className="chart-footer" style={{ lineHeight: 1.5 }}>
          <div>Bolhas azuis = total por UF. As cores por ramo aparecem no gráfico complementar à direita.</div>
          <div>Geometria: malhas estaduais do IBGE, vetorizadas para SVG. Total atual: N = {totalAtual}.</div>
        </div>
      </section>

      <section className="chart-card" style={{ display: "flex", flexDirection: "column" }} aria-label="Distribuição das unidades por UF e ramo">
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Unidades por UF e ramo de Justiça</h3>
            <p className="chart-subtitle">Contagens do filtro atual; ordenação decrescente por UF</p>
          </div>
          <div style={{ display: "flex", gap: "0.35rem" }}>
            <button className={`btn btn-sm ${!modoPercentual ? "btn-primary" : "btn-outline"}`}
              onClick={() => setModoPercentual(false)} aria-pressed={!modoPercentual}>Qtd (n)</button>
            <button className={`btn btn-sm ${modoPercentual ? "btn-primary" : "btn-outline"}`}
              onClick={() => setModoPercentual(true)} aria-pressed={modoPercentual}>%</button>
            <button className="btn btn-outline btn-sm" onClick={baixarTerritorio}
              title="Exportar contagens por UF e ramo do recorte atual" aria-label="Baixar tabela territorial em CSV">
              <Download size={13} />
            </button>
          </div>
        </div>

        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.5rem 0.8rem", fontSize: "0.75rem", marginBottom: "0.85rem" }}>
          {SEG_ORDEM.map(ramo => (
            <div key={ramo} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <span style={{ width: 10, height: 10, backgroundColor: CORES_RAMO[ramo], borderRadius: 2, display: "inline-block" }} />
              <span>{RAMO_CURTO[ramo]}</span>
            </div>
          ))}
        </div>

        <div style={{ flex: 1, overflowY: "auto", maxHeight: "505px", display: "flex", flexDirection: "column", gap: "0.45rem", paddingRight: "0.5rem" }}>
          {ufsOrdenadas.filter(g => (contagemFiltrada.get(g.uf)?.total || 0) > 0).map(g => {
            const info = contagemFiltrada.get(g.uf)!;
            return (
              <button
                key={g.uf} type="button"
                style={{
                  display: "flex", alignItems: "center", width: "100%", gap: "0.5rem",
                  fontSize: "0.8rem", cursor: "pointer", padding: "0.25rem",
                  border: "none", borderRadius: 4, textAlign: "left",
                  background: ufSelecionada === g.uf ? "#E8F4FB" : "transparent",
                }}
                onClick={() => onSelectUf(ufSelecionada === g.uf ? "" : g.uf)}
                aria-label={`${g.nome}: ${info.total} unidades. Selecionar ou limpar filtro.`}
              >
                <span style={{ width: 28, flexShrink: 0, fontWeight: 700, color: "#00367C" }}>{g.uf}</span>
                <span style={{ flex: 1, height: 15, backgroundColor: "#E2E8F0", borderRadius: 3, overflow: "hidden", display: "flex" }}>
                  {SEG_ORDEM.map(ramo => {
                    const qtd = info.ramos[ramo] || 0;
                    if (!qtd) return null;
                    const largura = 100 * qtd / (modoPercentual ? info.total : maxUf);
                    return (
                      <span
                        key={ramo}
                        style={{ width: `${largura}%`, height: "100%", backgroundColor: CORES_RAMO[ramo], transition: "width 0.2s ease" }}
                        title={`${RAMO_CURTO[ramo]}: ${qtd} (${(100 * qtd / info.total).toFixed(1)}%)`}
                      />
                    );
                  })}
                </span>
                <span style={{ width: 31, flexShrink: 0, textAlign: "right", fontWeight: 700, color: "#1E293B" }}>{info.total}</span>
              </button>
            );
          })}
          {totalAtual === 0 && <div style={{ color: "#64748B", fontSize: "0.85rem" }}>Nenhuma unidade corresponde aos filtros atuais.</div>}
        </div>
        <div className="chart-footer">
          {modoPercentual
            ? "Cada barra representa 100% das unidades da respectiva UF no recorte. O número à direita indica o total absoluto."
            : `Barras em escala comum, de 0 a ${maxUf} unidades. A composição por ramo está indicada pelas cores.`}
          <div>Clique em uma barra para selecionar a UF. CSV exporta os totais do filtro atual.</div>
        </div>
      </section>
    </div>
  );
};
