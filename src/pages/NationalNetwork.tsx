import React from "react";
import { GeoUF, UnidadePublica } from "../types";
import { BrazilMap } from "../components/BrazilMap";
import { MapPin, Building2, School } from "lucide-react";

interface NationalNetworkProps {
  geoUfs: GeoUF[];
  unidades: UnidadePublica[];
  ufSelecionada: string;
  onSelectUf: (uf: string) => void;
}

export const NationalNetwork: React.FC<NationalNetworkProps> = ({
  geoUfs,
  unidades,
  ufSelecionada,
  onSelectUf,
}) => {
  const nTotal = unidades.length;
  const nUfsPresentes = new Set(unidades.map((u) => u.uf)).size;

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#00367C", marginBottom: "0.4rem" }}>
          Rede Nacional & Distribuição Territorial das Unidades
        </h2>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Mapeamento das sedes institucionais por Unidade da Federação e ramo de justiça · {nTotal} unidades em {nUfsPresentes} UFs
        </p>
      </div>

      {/* Cartões de Síntese Territorial */}
      <div className="card-grid" style={{ marginBottom: "2rem" }}>
        <div className="metric-card">
          <div className="metric-header">Cobertura Federativa</div>
          <div className="metric-val">{nUfsPresentes} UFs</div>
          <div className="metric-desc">Presença de unidades em todas as 27 Unidades da Federação.</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">Maior Concentração</div>
          <div className="metric-val" style={{ color: "#0163AC" }}>DF (13)</div>
          <div className="metric-desc">Seguido por SP (8 unidades), RJ (6 unidades) e MG, RS, CE (5 cada).</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">Representação dos Tribunais</div>
          <div className="metric-val" style={{ color: "#2E7D32" }}>98,9%</div>
          <div className="metric-desc">90 de 91 tribunais no escopo (única ausência: TJAL).</div>
        </div>
      </div>

      {/* Componente Integrado do Mapa Interativo e Barras Empilhadas */}
      <BrazilMap
        geoUfs={geoUfs}
        unidadesFiltradas={unidades}
        ufSelecionada={ufSelecionada}
        onSelectUf={onSelectUf}
      />

      {/* Nota Metodológica de Cobertura Territorial */}
      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "1.25rem", borderRadius: "8px", fontSize: "0.85rem", color: "#475569", lineHeight: 1.5 }}>
        <strong>Nota Metodológica Territorial (Capítulo 4 do Relatório):</strong> O questionário oficial não coletou a localidade geográfica de execução das ações formativas (que frequentemente alcançam comarcas do interior via EaD ou itinerância). A distribuição cartográfica reflete unicamente a <em>UF da sede institucional proxy</em> inferida a partir da sigla do órgão (ex.: TRT5 na Bahia, TRF1 no Distrito Federal). A agregação obedece à salvaguarda R01.1.
      </div>
    </div>
  );
};
