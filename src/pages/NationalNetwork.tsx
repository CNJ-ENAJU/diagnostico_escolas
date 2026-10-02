import React, { useMemo } from "react";
import { GeoUF, UnidadePublica } from "../types";
import { BrazilMap } from "../components/BrazilMap";

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
  const nUfsPresentes = new Set(unidades.map(u => u.uf)).size;
  const nOrgaos = new Set(unidades.map(u => u.sigla_orgao)).size;
  const recorteIntegral = nTotal === 110 && nOrgaos === 92;

  const porUf = useMemo(() => {
    const contagens = new Map<string, number>();
    for (const u of unidades) contagens.set(u.uf, (contagens.get(u.uf) || 0) + 1);
    return [...contagens.entries()].sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  }, [unidades]);

  const principal = porUf[0];
  const demais = porUf.slice(1);
  const gruposSecundarios = useMemo(() => {
    const grupos = new Map<number, string[]>();
    for (const [uf, n] of demais) {
      if (!grupos.has(n)) grupos.set(n, []);
      grupos.get(n)!.push(uf);
    }
    // Nacional: SP (8), RJ (6), AM, CE, MG, PE e RS (5 cada).
    return [...grupos.entries()].slice(0, 3).map(([n, siglas]) => {
      const rotulo = siglas.length === 1 ? siglas[0] : siglas.slice(0, -1).join(", ") + " e " + siglas[siglas.length - 1];
      return `${rotulo} (${n}${siglas.length > 1 ? " cada" : ""})`;
    }).join("; ");
  }, [demais]);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#00367C", marginBottom: "0.4rem" }}>
          Rede Nacional &amp; Distribuição Territorial das Unidades
        </h2>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          UF da sede institucional proxy e ramo de justiça · {nTotal} unidades respondentes em {nUfsPresentes} UFs no recorte
        </p>
      </div>

      <div className="card-grid" style={{ marginBottom: "1.5rem" }}>
        <div className="metric-card">
          <div className="metric-header">UFs representadas no recorte</div>
          <div className="metric-val">{nUfsPresentes} UFs</div>
          <div className="metric-desc">
            {recorteIntegral
              ? "As 110 unidades respondentes abrangem as 27 UFs por sede institucional proxy."
              : "A amostra integral compreende 27 UFs. Este valor considera apenas os filtros atualmente aplicados."}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-header">Maior quantidade no recorte</div>
          <div className="metric-val" style={{ color: "#0163AC" }}>
            {principal ? `${principal[0]} (${principal[1]})` : "Sem unidades"}
          </div>
          <div className="metric-desc">
            {demais.length > 0
              ? `Demais concentrações: ${gruposSecundarios}.`
              : principal
                ? "Somente uma UF permanece após a aplicação dos filtros."
                : "Amplie ou limpe os filtros para consultar a distribuição territorial."}
          </div>
        </div>
        <div className="metric-card">
          <div className="metric-header">
            {recorteIntegral ? "Representação dos tribunais" : "Órgãos distintos no recorte"}
          </div>
          <div className="metric-val" style={{ color: "#2E7D32" }}>
            {recorteIntegral ? "98,9%" : nOrgaos}
          </div>
          <div className="metric-desc">
            {recorteIntegral
              ? "90 dos 91 tribunais no escopo responderam. Ausência de resposta do TJAL; Alagoas possui duas unidades de outros ramos na base."
              : `${nOrgaos} órgão(s) com unidades correspondentes aos filtros. Os 90/91 tribunais referem-se somente à amostra integral.`}
          </div>
        </div>
      </div>

      <BrazilMap
        geoUfs={geoUfs}
        unidadesFiltradas={unidades}
        ufSelecionada={ufSelecionada}
        onSelectUf={onSelectUf}
      />

      <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "1.25rem", borderRadius: "8px", fontSize: "0.85rem", color: "#475569", lineHeight: 1.6 }}>
        <strong>Nota metodológica territorial (Relatório, Capítulo 3, seção 3.1):</strong>{" "}
        o questionário não coletou as localidades geográficas de execução das ações formativas. A cartografia utiliza somente a
        <em> UF da sede institucional proxy</em>, atribuída pela identificação e sigla do órgão, inclusive para instituições de
        jurisdição nacional ou inter-regional. Não permite inferir a cobertura territorial efetiva dos cursos. O mapa representa
        unidades respondentes, não o número definitivo de escolas existentes em cada UF. Os contornos estaduais provêm de
        geometria vetorial baseada nas malhas do IBGE.
      </div>
    </div>
  );
};
