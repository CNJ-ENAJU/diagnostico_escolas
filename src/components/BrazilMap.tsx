import React, { useEffect, useMemo, useState } from "react";
import { GeoUF, UnidadePublica } from "../types";
import { CORES_RAMO, SEG_ORDEM } from "../config";
import { MAP_HEIGHT, MAP_WIDTH, projectBrazil, UF_PATHS } from "../data/brazilUfPaths";
import { Download, Filter, X } from "lucide-react";
import { baixarCSV, gerarCSVDeObjetos } from "../services/dataService";

interface BrazilMapProps {
  geoUfs: GeoUF[];
  unidadesFiltradas: UnidadePublica[];
  ufSelecionada: string;
  onSelectUf: (uf: string) => void;
}

type UFCount = { total: number; ramos: Record<string, number>; orgaos: Set<string> };

const LABEL_OFFSET: Record<string, [number, number]> = {
  CE: [2, -12], RN: [25, -17], PB: [29, -3], PE: [25, 10], AL: [33, 22],
  SE: [17, 32], PI: [-14, -4], DF: [18, 17], GO: [-15, -13], RJ: [13, 7], ES: [14, -6],
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
  const [detailUf, setDetailUf] = useState<GeoUF | null>(null);
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

  const unidadesDaUf = useMemo(() => {
    if (!detailUf) return [];
    return unidadesFiltradas
      .filter(u => u.uf === detailUf.uf)
      .sort((a, b) => a.ramo.localeCompare(b.ramo) || a.sigla_orgao.localeCompare(b.sigla_orgao));
  }, [detailUf, unidadesFiltradas]);

  const ufsOrdenadas = useMemo(() =>
    [...geoUfs].sort((a, b) =>
      (contagemFiltrada.get(b.uf)?.total || 0) - (contagemFiltrada.get(a.uf)?.total || 0) ||
      a.uf.localeCompare(b.uf)
    ), [geoUfs, contagemFiltrada]
  );

  const maxUf = Math.max(1, ...ufsOrdenadas.map(g => contagemFiltrada.get(g.uf)?.total || 0));
  const totalAtual = unidadesFiltradas.length;

  useEffect(() => {
    if (!detailUf) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setDetailUf(null);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [detailUf]);

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
    return { anchor, x, y, r, displaced: dx !== 0 || dy !== 0 };
  };

  const abrirDetalhes = (uf: string) => {
    const g = geoIndex.get(uf);
    if (g && (contagemFiltrada.get(uf)?.total || 0) > 0) setDetailUf(g);
  };

  const detalheCount = detailUf ? contagemFiltrada.get(detailUf.uf) : undefined;

  return (
    <>
      <div className="network-explorer">
        <section className="chart-card network-map-card" aria-label="Mapa das unidades respondentes por UF de sede proxy">
          <div className="chart-header network-map-header">
            <div>
              <h3 className="chart-title">Mapa interativo das unidades por UF</h3>
              <p className="chart-subtitle">
                Clique em um estado ou bolha para abrir os detalhes · tamanho da bolha = unidades no recorte
              </p>
            </div>
            {ufSelecionada && (
              <button className="btn btn-outline btn-sm" onClick={() => onSelectUf("")}>
                Limpar filtro {ufSelecionada}
              </button>
            )}
          </div>

          <div className="network-map-stage">
            <svg
              viewBox={`0 0 ${MAP_WIDTH} ${MAP_HEIGHT}`}
              width="100%"
              role="img"
              aria-label="Brasil com contornos das 27 Unidades da Federação e bolhas proporcionais às unidades respondentes"
              className="network-map-svg"
            >
              <g aria-label="Limites estaduais da cartografia do IBGE">
                {UF_PATHS.map(feature => {
                  const count = contagemFiltrada.get(feature.uf)?.total || 0;
                  const selected = ufSelecionada === feature.uf;
                  const clickable = count > 0;
                  return (
                    <path
                      key={feature.uf}
                      d={feature.path}
                      className={`network-state ${selected ? "selected" : ""} ${clickable ? "clickable" : ""}`}
                      fill={selected ? "#cfe5f8" : count > 0 ? "#edf4fa" : "#f7f9fb"}
                      stroke={selected ? "#0163AC" : "#a9bed0"}
                      strokeWidth={selected ? 1.7 : 0.85}
                      fillRule="evenodd"
                      onClick={() => clickable && abrirDetalhes(feature.uf)}
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
                  const title = `${g.nome}: ${count} unidade(s). Clique para abrir os detalhes.`;
                  return (
                    <g
                      key={g.uf}
                      role="button"
                      tabIndex={0}
                      aria-label={title}
                      className="network-marker"
                      onClick={() => abrirDetalhes(g.uf)}
                      onKeyDown={e => {
                        if (e.key === "Enter" || e.key === " ") {
                          e.preventDefault();
                          abrirDetalhes(g.uf);
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
                        cx={pt.x} cy={pt.y} r={pt.r + (selected ? 4 : 2)}
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

            <div className="network-hover-card" aria-live="polite">
              {hoveredUf ? (() => {
                const c = contagemFiltrada.get(hoveredUf.uf);
                const ramos = SEG_ORDEM.filter(r => (c?.ramos[r] || 0) > 0)
                  .map(r => `${RAMO_CURTO[r]} ${c!.ramos[r]}`).join(" · ");
                return (
                  <>
                    <strong>{hoveredUf.nome} ({hoveredUf.uf})</strong>
                    <span>{c?.total || 0} unidades · {c?.orgaos.size || 0} órgãos</span>
                    <span>{ramos || "Sem unidades neste recorte"}</span>
                  </>
                );
              })() : (
                <>
                  <strong>Explore o mapa</strong>
                  <span>Passe o mouse para uma leitura rápida. Clique para abrir o detalhamento completo da UF.</span>
                </>
              )}
            </div>
          </div>

          <div className="chart-footer" style={{ lineHeight: 1.5 }}>
            <div>Bolhas azuis = total por UF. As cores por ramo aparecem no painel lateral e no popup.</div>
            <div>Geometria: malhas estaduais do IBGE, vetorizadas para SVG. Total atual: N = {totalAtual}.</div>
          </div>
        </section>

        <aside className="chart-card network-side-card" aria-label="Distribuição das unidades por UF e ramo">
          <div className="chart-header network-side-header">
            <div>
              <h3 className="chart-title">UFs e ramos</h3>
              <p className="chart-subtitle">Distribuição no recorte atual</p>
            </div>
            <div style={{ display: "flex", gap: "0.35rem", flexWrap: "wrap", justifyContent: "flex-end" }}>
              <button className={`btn btn-sm ${!modoPercentual ? "btn-primary" : "btn-outline"}`}
                onClick={() => setModoPercentual(false)} aria-pressed={!modoPercentual}>n</button>
              <button className={`btn btn-sm ${modoPercentual ? "btn-primary" : "btn-outline"}`}
                onClick={() => setModoPercentual(true)} aria-pressed={modoPercentual}>%</button>
              <button className="btn btn-outline btn-sm" onClick={baixarTerritorio}
                title="Exportar contagens por UF e ramo do recorte atual" aria-label="Baixar tabela territorial em CSV">
                <Download size={13} />
              </button>
            </div>
          </div>

          <div className="network-legend">
            {SEG_ORDEM.map(ramo => (
              <div key={ramo} className="network-legend-item">
                <span style={{ backgroundColor: CORES_RAMO[ramo] }} />
                {RAMO_CURTO[ramo]}
              </div>
            ))}
          </div>

          <div className="network-bars">
            {ufsOrdenadas.filter(g => (contagemFiltrada.get(g.uf)?.total || 0) > 0).map(g => {
              const info = contagemFiltrada.get(g.uf)!;
              return (
                <button
                  key={g.uf} type="button"
                  className={`network-bar-row ${ufSelecionada === g.uf ? "selected" : ""}`}
                  onClick={() => abrirDetalhes(g.uf)}
                  aria-label={`${g.nome}: ${info.total} unidades. Abrir detalhes.`}
                >
                  <span className="network-bar-uf">{g.uf}</span>
                  <span className="network-bar-track">
                    {SEG_ORDEM.map(ramo => {
                      const qtd = info.ramos[ramo] || 0;
                      if (!qtd) return null;
                      const largura = 100 * qtd / (modoPercentual ? info.total : maxUf);
                      return (
                        <span
                          key={ramo}
                          style={{ width: `${largura}%`, backgroundColor: CORES_RAMO[ramo] }}
                          title={`${RAMO_CURTO[ramo]}: ${qtd} (${(100 * qtd / info.total).toFixed(1)}%)`}
                        />
                      );
                    })}
                  </span>
                  <span className="network-bar-total">{info.total}</span>
                </button>
              );
            })}
            {totalAtual === 0 && <div style={{ color: "#64748B", fontSize: "0.85rem" }}>Nenhuma unidade corresponde aos filtros atuais.</div>}
          </div>

          <div className="chart-footer">
            {modoPercentual
              ? "Cada barra representa 100% da respectiva UF."
              : `Escala comum de 0 a ${maxUf} unidades.`}
            <div>Clique em uma linha para abrir o popup da UF.</div>
          </div>
        </aside>
      </div>

      {detailUf && detalheCount && (
        <div className="network-modal-backdrop" role="presentation" onMouseDown={() => setDetailUf(null)}>
          <section
            className="network-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="network-modal-title"
            onMouseDown={e => e.stopPropagation()}
          >
            <header className="network-modal-header">
              <div>
                <div className="network-modal-kicker">Detalhamento territorial · recorte atual</div>
                <h3 id="network-modal-title">{detailUf.nome} <span>({detailUf.uf})</span></h3>
                <p>{detailUf.regiao} · UF de sede institucional proxy</p>
              </div>
              <button className="network-modal-close" onClick={() => setDetailUf(null)} aria-label="Fechar detalhes da UF">
                <X size={20} />
              </button>
            </header>

            <div className="network-modal-summary">
              <div><strong>{detalheCount.total}</strong><span>unidades</span></div>
              <div><strong>{detalheCount.orgaos.size}</strong><span>órgãos</span></div>
              <div><strong>{SEG_ORDEM.filter(r => (detalheCount.ramos[r] || 0) > 0).length}</strong><span>ramos presentes</span></div>
            </div>

            <div className="network-modal-section">
              <h4>Composição por ramo</h4>
              <div className="network-modal-ramos">
                {SEG_ORDEM.filter(r => (detalheCount.ramos[r] || 0) > 0).map(ramo => {
                  const n = detalheCount.ramos[ramo] || 0;
                  const pct = detalheCount.total ? 100 * n / detalheCount.total : 0;
                  return (
                    <div className="network-modal-ramo" key={ramo}>
                      <div>
                        <span className="network-modal-swatch" style={{ backgroundColor: CORES_RAMO[ramo] }} />
                        <span>{RAMO_CURTO[ramo]}</span>
                        <strong>{n}</strong>
                      </div>
                      <div className="network-modal-progress">
                        <span style={{ width: `${pct}%`, backgroundColor: CORES_RAMO[ramo] }} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="network-modal-section">
              <h4>Unidades respondentes</h4>
              <div className="network-modal-unit-list">
                {unidadesDaUf.map(u => (
                  <div className="network-modal-unit" key={u.id_unidade}>
                    <div>
                      <strong>{u.escola_unidade}</strong>
                      <span>{u.sigla_orgao} · {u.orgao}</span>
                    </div>
                    <div className="network-modal-tags">
                      <span>{RAMO_CURTO[u.ramo] || u.ramo}</span>
                      <span>{u.natureza}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <footer className="network-modal-footer">
              <div>
                A UF é uma proxy de sede institucional e não representa a abrangência geográfica das ações formativas.
              </div>
              <div className="network-modal-actions">
                <button className="btn btn-outline" onClick={() => setDetailUf(null)}>Fechar</button>
                <button
                  className="btn btn-primary"
                  onClick={() => {
                    onSelectUf(detailUf.uf);
                    setDetailUf(null);
                  }}
                >
                  <Filter size={15} />
                  Filtrar painel por {detailUf.uf}
                </button>
              </div>
            </footer>
          </section>
        </div>
      )}
    </>
  );
};
