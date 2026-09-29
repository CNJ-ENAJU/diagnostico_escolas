import React from "react";
import { UnidadePublica, IndicadorCorte } from "../types";
import { ChartCard, ItemGrafico } from "../components/ChartCard";
import { SmallGroupAlert } from "../components/SmallGroupAlert";
import { MIN_PUBLIC_GROUP_SIZE } from "../config";

interface CooperationProps {
  unidades: UnidadePublica[];
  indicadores: IndicadorCorte[];
  ramoSelecionado: string;
}

export const Cooperation: React.FC<CooperationProps> = ({ unidades, indicadores, ramoSelecionado }) => {
  const nAtual = unidades.length;
  const isSmallGroup = nAtual < MIN_PUBLIC_GROUP_SIZE;
  const modoAbsoluto = nAtual <= 10;

  // 1. Interesse em Articulação em Rede com ENAJU/CNJ
  const itensInteresse: ItemGrafico[] = React.useMemo(() => {
    const calc = (nivel: string, rotulo: string, cor: string): ItemGrafico => {
      const n = unidades.filter(u => u.interesse_enaju === nivel).length;
      return {
        rotulo,
        n,
        N: nAtual,
        pct: nAtual > 0 ? (100 * n) / nAtual : 0,
        cor,
      };
    };

    return [
      calc("Alto", "Alto interesse em atuar em rede com a ENAJU/CNJ", "#2E7D32"),
      calc("Moderado", "Moderado interesse em atuar em rede", "#0163AC"),
      calc("Baixo", "Baixo interesse", "#94A3B8"),
    ];
  }, [unidades, nAtual]);

  // 2. Parcerias Institucionais Vigentes
  const itensParcerias: ItemGrafico[] = React.useMemo(() => {
    const calc = (termo: string, rotulo: string, cor: string): ItemGrafico => {
      const n = unidades.filter(u => u.parcerias.includes(termo)).length;
      return {
        rotulo,
        n,
        N: nAtual,
        pct: nAtual > 0 ? (100 * n) / nAtual : 0,
        cor,
      };
    };

    return [
      calc("convênios", "Mantém parcerias formais vigentes (acordos e convênios)", "#00367C"),
      calc("informais", "Mantém parcerias em regime informal", "#D9982B"),
      calc("Não mantém", "Não mantém parcerias institucionais", "#64748B"),
    ];
  }, [unidades, nAtual]);

  // 3. Modalidades de Cooperação Praticadas
  const itensModalidades: ItemGrafico[] = React.useMemo(() => {
    const contarMod = (termo: string, rotulo: string, cor: string): ItemGrafico => {
      const n = unidades.filter(u => u.modalidades_cooperacao.includes(termo)).length;
      return {
        rotulo,
        n,
        N: nAtual,
        pct: nAtual > 0 ? (100 * n) / nAtual : 0,
        cor,
      };
    };

    return [
      contarMod("vagas", "Compartilhamento de vagas em cursos", "#00367C"),
      contarMod("conteúdos", "Compartilhamento de materiais e conteúdos educacionais", "#0163AC"),
      contarMod("produção conjunta", "Produção e oferta conjunta de cursos", "#009BD4"),
      contarMod("formadores", "Intercâmbio de docentes e formadores", "#3E9F9B"),
      contarMod("redes", "Participação em redes temáticas e fóruns colaborativos", "#64748B"),
    ];
  }, [unidades, nAtual]);

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
          <div className="metric-val" style={{ color: "#2E7D32" }}>99,1%</div>
          <div className="metric-desc">Das 110 unidades manifestaram alto (76,4%) ou moderado (22,7%) interesse em integrar a rede.</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">Convênios Vigentes</div>
          <div className="metric-val" style={{ color: "#00367C" }}>64,5%</div>
          <div className="metric-desc">Mantêm acordos formais de parceria com outras escolas judiciais, universidades ou órgãos públicos.</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">Compartilhamento de Vagas</div>
          <div className="metric-val" style={{ color: "#0163AC" }}>88,2%</div>
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
          linkRelatorio={{ capitulo: "Capítulo 11", texto: "Perspectivas para a Atuação em Rede da ENAJU" }}
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
          linkRelatorio={{ capitulo: "Capítulo 11", texto: "Parcerias Institucionais e Convênios" }}
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
          linkRelatorio={{ capitulo: "Capítulo 11", texto: "Modalidades de Articulação em Rede" }}
        />
      </div>
    </div>
  );
};
