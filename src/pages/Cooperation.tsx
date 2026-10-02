import React from "react";
import { UnidadePublica, IndicadorCorte } from "../types";
import { ChartCard, ItemGrafico } from "../components/ChartCard";
import { SmallGroupAlert } from "../components/SmallGroupAlert";
import { MIN_PUBLIC_GROUP_SIZE } from "../config";
import { itemCategoria, percentual, temOpcao } from "../services/metricasCanonicas";

interface CooperationProps {
  unidades: UnidadePublica[];
  indicadores: IndicadorCorte[];
  ramoSelecionado: string;
}

export const Cooperation: React.FC<CooperationProps> = ({ unidades, indicadores, ramoSelecionado }) => {
  const nAtual = unidades.length;
  const isSmallGroup = nAtual < MIN_PUBLIC_GROUP_SIZE;
  const modoAbsoluto = nAtual <= 10;

  const itensInteresse: ItemGrafico[] = React.useMemo(() => [
    "Alto", "Moderado", "Baixo"
  ].map(c => itemCategoria(unidades, "interesse_enaju", c)), [unidades]);

  const itensParcerias: ItemGrafico[] = React.useMemo(() => [
    "Sim, com convênios/acordos vigentes",
    "Sim, com parcerias informais",
    "Não mantém parcerias",
  ].map(c => itemCategoria(unidades, "parcerias", c)), [unidades]);

  const itensModalidades: ItemGrafico[] = React.useMemo(() => [
    "Compartilhamento de cursos / vagas entre escolas",
    "Compartilhamento de conteúdos e objetos de aprendizagem",
    "Produção conjunta de ações formativas",
    "Intercâmbio de formadores",
    "Participação em redes nacionais temáticas",
  ].map(c => itemCategoria(unidades, "modalidades_cooperacao", c)), [unidades]);

  const nInteresse = unidades.filter(u => u.interesse_enaju === "Alto" || u.interesse_enaju === "Moderado").length;
  const nConvenios = unidades.filter(u => u.parcerias === "Sim, com convênios/acordos vigentes").length;
  const nVagas = unidades.filter(u => temOpcao(u.modalidades_cooperacao, "Compartilhamento de cursos / vagas entre escolas")).length;

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#00367C", marginBottom: "0.4rem" }}>
          Cooperação Interinstitucional & Articulação ENAJU
        </h2>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Acordos formais, modalidades colaborativas e receptividade à coordenação em rede pela ENAJU/CNJ · N = {nAtual}
        </p>
      </div>

      {isSmallGroup && <SmallGroupAlert nAtual={nAtual} />}

      {/* Cards de Destaque */}
      <div className="card-grid" style={{ marginBottom: "2rem" }}>
        <div className="metric-card">
          <div className="metric-header">Abertura Positiva ENAJU</div>
          <div className="metric-val" style={{ color: "#2E7D32" }}>{percentual(nInteresse, nAtual)}</div>
          <div className="metric-desc">Interesse alto ou moderado declarado (n = {nInteresse}, N = {nAtual}), sem confundir intenção e cooperação já existente.</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">Convênios Vigentes</div>
          <div className="metric-val" style={{ color: "#00367C" }}>{percentual(nConvenios, nAtual)}</div>
          <div className="metric-desc">Mantêm acordos formais de parceria com outras escolas judiciais, universidades ou órgãos públicos.</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">Compartilhamento de Vagas</div>
          <div className="metric-val" style={{ color: "#0163AC" }}>{percentual(nVagas, nAtual)}</div>
          <div className="metric-desc">É a modalidade de cooperação mais praticada e demandada pelas unidades da rede.</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: "1.5rem" }}>
        {/* Gráfico 1: Interesse na ENAJU */}
        <ChartCard
          titulo="Interesse em Articulação com a ENAJU / CNJ"
          subtitulo="Grau de receptividade das unidades à atuação coordenada pela Escola Nacional"
          itens={itensInteresse}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Disposição manifestada pela unidade para atuar em rede com a ENAJU/CNJ.",
            perguntaOrigem: "Q43 do formulário oficial (interesse em iniciativas conjuntas).",
            denominador: `N = ${nAtual} unidades respondentes.`,
            regraCalculo: "Percentual por grau de interesse autodeclarado.",
            limitacao: "Autodeclarado."
          }}
          linkRelatorio={{ capitulo: "Capítulo 10", texto: "Perspectivas para a Atuação em Rede da ENAJU" }}
        />

        {/* Gráfico 2: Parcerias Formais */}
        <ChartCard
          titulo="Manutenção de Parcerias Institucionais"
          subtitulo="Natureza dos vínculos colaborativos mantidos com outras instituições"
          itens={itensParcerias}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Formalização de parcerias e acordos de cooperação.",
            perguntaOrigem: "Q40 do formulário oficial.",
            denominador: `N = ${nAtual} unidades respondentes.`,
            regraCalculo: "Percentual por arranjo de parceria declarado.",
            limitacao: "Autodeclarado."
          }}
          linkRelatorio={{ capitulo: "Capítulo 10", texto: "Parcerias Institucionais e Convênios" }}
        />
      </div>

      {/* Gráfico 3: Modalidades de Cooperação */}
      <div style={{ marginTop: "1.5rem" }}>
        <ChartCard
          titulo="Modalidades de Cooperação Mais Praticadas"
          subtitulo="Formatos de colaboração efetiva entre as unidades de formação do Judiciário"
          itens={itensModalidades}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Práticas colaborativas em vigor entre escolas e unidades.",
            perguntaOrigem: "Q42 do formulário oficial.",
            denominador: `N = ${nAtual} unidades respondentes.`,
            regraCalculo: "Múltipla escolha (respondente com a opção assinalada).",
            limitacao: "Múltipla escolha; percentuais não somam 100%."
          }}
          linkRelatorio={{ capitulo: "Capítulo 10", texto: "Modalidades de Articulação em Rede" }}
        />
      </div>
    </div>
  );
};
