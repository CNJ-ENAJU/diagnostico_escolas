import React, { useState } from "react";
import { GeoUF, UnidadePublica } from "../types";
import { CORES, CORES_RAMO, SEG_ORDEM, ROTULOS_RAMO } from "../config";
import { Download } from "lucide-react";
import { baixarCSV, gerarCSVDeObjetos } from "../services/dataService";

interface BrazilMapProps {
  geoUfs: GeoUF[];
  unidadesFiltradas: UnidadePublica[];
  ufSelecionada: string;
  onSelectUf: (uf: string) => void;
}

export const BrazilMap: React.FC<BrazilMapProps> = ({
  geoUfs,
  unidadesFiltradas,
  ufSelecionada,
  onSelectUf,
}) => {
  const [hoveredUf, setHoveredUf] = useState<GeoUF | null>(null);
  const [modoPercentual, setModoPercentual] = useState<boolean>(false);

  // Mapear contagens atuais filtradas por UF
  const contagemFiltrada = React.useMemo(() => {
    const mapa = new Map<string, { total: number; ramos: Record<string, number> }>();
    unidadesFiltradas.forEach((u) => {
      if (!mapa.has(u.uf)) {
        mapa.set(u.uf, { total: 0, ramos: {} });
      }
      const item = mapa.get(u.uf)!;
      item.total += 1;
      item.ramos[u.ramo] = (item.ramos[u.ramo] || 0) + 1;
    });
    return mapa;
  }, [unidadesFiltradas]);

  // Projeção simples de lat/lon para SVG (lon -74 a -34, lat 5 a -34)
  const larguraSVG = 520;
  const alturaSVG = 480;

  const projetar = (lon: number, lat: number) => {
    const x = ((lon - (-74)) / ( -34 - (-74) )) * (larguraSVG - 80) + 40;
    const y = ((5 - lat) / ( 5 - (-34) )) * (alturaSVG - 80) + 40;
    return { x, y };
  };

  // UFs ordenadas para o gráfico de barras
  const ufsOrdenadas = React.useMemo(() => {
    return [...geoUfs].sort((a, b) => {
      const totA = contagemFiltrada.get(a.uf)?.total || 0;
      const totB = contagemFiltrada.get(b.uf)?.total || 0;
      return totB - totA;
    });
  }, [geoUfs, contagemFiltrada]);

  const handleBaixarTerritorio = () => {
    const linhas = ufsOrdenadas.map((g) => {
      const info = contagemFiltrada.get(g.uf);
      return {
        uf: g.uf,
        estado: g.nome,
        regiao: g.regiao,
        unidades_total: info?.total || 0,
        ...info?.ramos,
      };
    });
    baixarCSV(gerarCSVDeObjetos(linhas), "distribuicao_territorial_ufs.csv");
  };

  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(420px, 1fr))", gap: "1.5rem", marginBottom: "2rem" }}>
      {/* 1. Mapa Visual do Brasil */}
      <div className="chart-card" style={{ position: "relative", minHeight: "540px" }}>
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Mapa da Rede Nacional de Unidades</h3>
            <p className="chart-subtitle">
              Sedes institucionais proxy (27 UFs) · Clique em uma UF para filtrar
            </p>
          </div>
          {ufSelecionada && (
            <button className="btn btn-outline btn-sm" onClick={() => onSelectUf("")}>
              Limpar UF ({ufSelecionada})
            </button>
          )}
        </div>

        {/* SVG Interativo com Bolhas Proporcionais */}
        <div style={{ display: "flex", justifyContent: "center", position: "relative" }}>
          <svg width={larguraSVG} height={alturaSVG} viewBox={`0 0 ${larguraSVG} ${alturaSVG}`}>
            {/* Contorno simplificado do Brasil */}
            <path
              d="M 120 70 L 220 50 L 320 110 L 440 180 L 470 230 L 420 300 L 380 340 L 300 450 L 250 440 L 210 350 L 110 240 L 70 170 Z"
              fill="#F1F5F9"
              stroke="#CBD5E1"
              strokeWidth="1.5"
              strokeDasharray="4 2"
            />

            {/* Marcadores / Bolhas por UF */}
            {geoUfs.map((g) => {
              const { x, y } = projetar(g.lon, g.lat);
              const info = contagemFiltrada.get(g.uf);
              const totalUnidades = info ? info.total : 0;
              const isSelected = ufSelecionada === g.uf;
              
              // Raio proporcional
              const raio = Math.max(12, Math.min(32, 10 + totalUnidades * 2.2));

              return (
                <g 
                  key={g.uf} 
                  style={{ cursor: "pointer", transition: "transform 0.2s ease" }}
                  onClick={() => onSelectUf(isSelected ? "" : g.uf)}
                  onMouseEnter={() => setHoveredUf(g)}
                  onMouseLeave={() => setHoveredUf(null)}
                >
                  {/* Círculo externo para seleção */}
                  {isSelected && (
                    <circle
                      cx={x}
                      cy={y}
                      r={raio + 5}
                      fill="none"
                      stroke="#D9982B"
                      strokeWidth="3"
                    />
                  )}

                  {/* Bolha principal */}
                  <circle
                    cx={x}
                    cy={y}
                    r={raio}
                    fill={isSelected ? "#00367C" : totalUnidades > 0 ? "#0163AC" : "#94A3B8"}
                    fillOpacity={totalUnidades > 0 ? 0.85 : 0.4}
                    stroke="#ffffff"
                    strokeWidth="1.5"
                  />

                  {/* Texto da UF e Quantidade */}
                  <text
                    x={x}
                    y={y - 1}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="9px"
                    fontWeight="700"
                    pointerEvents="none"
                  >
                    {g.uf}
                  </text>
                  <text
                    x={x}
                    y={y + 9}
                    textAnchor="middle"
                    fill="#ffffff"
                    fontSize="8px"
                    fontWeight="500"
                    pointerEvents="none"
                  >
                    {totalUnidades}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Tooltip flutuante de detalhes da UF */}
          {hoveredUf && (
            <div
              style={{
                position: "absolute",
                bottom: "1rem",
                left: "1rem",
                background: "#ffffff",
                border: "1px solid #CBD5E1",
                boxShadow: "0 4px 6px -1px rgba(0,0,0,0.1)",
                borderRadius: "8px",
                padding: "0.75rem 1rem",
                fontSize: "0.82rem",
                zIndex: 10,
                pointerEvents: "none",
                maxWidth: "280px"
              }}
            >
              <div style={{ fontWeight: 700, color: "#00367C", fontSize: "0.95rem" }}>
                {hoveredUf.nome} ({hoveredUf.uf})
              </div>
              <div style={{ color: "#64748B", marginBottom: "0.4rem" }}>
                Região: {hoveredUf.regiao}
              </div>
              <div>
                <strong>Unidades na UF:</strong> {contagemFiltrada.get(hoveredUf.uf)?.total || 0}
              </div>
              <div>
                <strong>Órgãos sediados:</strong> {hoveredUf.n_orgaos}
              </div>
              <div>
                <strong>Ramos presentes:</strong> {hoveredUf.ramos.join(", ")}
              </div>
              <div style={{ marginTop: "0.3rem", fontSize: "0.75rem", color: "#0163AC" }}>
                Clique para filtrar todo o painel por {hoveredUf.uf}
              </div>
            </div>
          )}
        </div>

        <div className="chart-footer">
          <div>Nota: Localização da sede institucional proxy inferida da sigla. O questionário não coleta localidade das ações; N = 110.</div>
          <div>{CORES.navy} · Maior concentração: DF (13 unidades), SP (8 unidades), RJ (6 unidades).</div>
        </div>
      </div>

      {/* 2. Gráfico de Barras Empilhadas por UF e Ramo */}
      <div className="chart-card" style={{ display: "flex", flexDirection: "column" }}>
        <div className="chart-header">
          <div>
            <h3 className="chart-title">Unidades por UF e Ramo de Justiça</h3>
            <p className="chart-subtitle">
              Distribuição desagregada ordenada pelo volume total de unidades
            </p>
          </div>

          <div style={{ display: "flex", gap: "0.5rem" }}>
            <button
              className={`btn btn-sm ${!modoPercentual ? "btn-primary" : "btn-outline"}`}
              onClick={() => setModoPercentual(false)}
            >
              Qtd (n)
            </button>
            <button
              className={`btn btn-sm ${modoPercentual ? "btn-primary" : "btn-outline"}`}
              onClick={() => setModoPercentual(true)}
            >
              %
            </button>
            <button className="btn btn-outline btn-sm" onClick={handleBaixarTerritorio} title="Baixar CSV">
              <Download size={13} />
            </button>
          </div>
        </div>

        {/* Legenda de Ramos */}
        <div style={{ display: "flex", flexWrap: "wrap", gap: "0.75rem", fontSize: "0.75rem", marginBottom: "1rem" }}>
          {SEG_ORDEM.map((ramo) => (
            <div key={ramo} style={{ display: "flex", alignItems: "center", gap: "0.3rem" }}>
              <div style={{ width: "10px", height: "10px", backgroundColor: CORES_RAMO[ramo], borderRadius: "2px" }} />
              <span>{ROTULOS_RAMO[ramo].split(" ")[1] || ramo}</span>
            </div>
          ))}
        </div>

        {/* Lista de Barras das UFs */}
        <div style={{ flex: 1, overflowY: "auto", maxHeight: "420px", display: "flex", flexDirection: "column", gap: "0.4rem", paddingRight: "0.5rem" }}>
          {ufsOrdenadas.map((g) => {
            const info = contagemFiltrada.get(g.uf);
            const total = info ? info.total : 0;
            if (total === 0) return null;

            return (
              <div 
                key={g.uf} 
                style={{ 
                  display: "flex", 
                  alignItems: "center", 
                  gap: "0.5rem", 
                  fontSize: "0.8rem",
                  cursor: "pointer",
                  padding: "0.15rem 0.3rem",
                  borderRadius: "4px",
                  background: ufSelecionada === g.uf ? "#E8F4FB" : "transparent"
                }}
                onClick={() => onSelectUf(ufSelecionada === g.uf ? "" : g.uf)}
              >
                <span style={{ width: "28px", fontWeight: 700, color: "#00367C" }}>{g.uf}</span>

                {/* Barra empilhada */}
                <div style={{ flex: 1, height: "14px", backgroundColor: "#E2E8F0", borderRadius: "3px", overflow: "hidden", display: "flex" }}>
                  {SEG_ORDEM.map((ramo) => {
                    const qtd = info?.ramos[ramo] || 0;
                    if (qtd === 0) return null;
                    const largura = modoPercentual ? (qtd / total) * 100 : (qtd / 13) * 100;

                    return (
                      <div
                        key={ramo}
                        style={{
                          width: `${largura}%`,
                          height: "100%",
                          backgroundColor: CORES_RAMO[ramo],
                          transition: "width 0.3s ease",
                        }}
                        title={`${ramo}: ${qtd} (${((qtd / total) * 100).toFixed(0)}%)`}
                      />
                    );
                  })}
                </div>

                <span style={{ width: "36px", textAlign: "right", fontWeight: 600, color: "#1E293B" }}>
                  {total}
                </span>
              </div>
            );
          })}
        </div>

        <div className="chart-footer">
          <div>Clique em uma barra para filtrar os indicadores pela respectiva UF.</div>
        </div>
      </div>
    </div>
  );
};
