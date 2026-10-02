import React from "react";
import { UnidadePublica, IndicadorCorte } from "../types";
import { ChartCard, ItemGrafico } from "../components/ChartCard";
import { SmallGroupAlert } from "../components/SmallGroupAlert";
import { MIN_PUBLIC_GROUP_SIZE } from "../config";
import { itemCategoria } from "../services/metricasCanonicas";

interface GovernanceProps {
  unidades: UnidadePublica[];
  indicadores: IndicadorCorte[];
  ramoSelecionado: string;
}

export const Governance: React.FC<GovernanceProps> = ({ unidades, indicadores, ramoSelecionado }) => {
  const nAtual = unidades.length;
  const isSmallGroup = nAtual < MIN_PUBLIC_GROUP_SIZE;
  const modoAbsoluto = nAtual <= 10;

  // 1. Planejamento Estratégico (Indicador A vs Indicador B)
  const itensPlanejamento: ItemGrafico[] = React.useMemo(() => {
    const calc = (cond: (u: UnidadePublica) => boolean, rotulo: string, cor: string, destaque = false): ItemGrafico => {
      const n = unidades.filter(cond).length;
      return {
        rotulo,
        n,
        N: nAtual,
        pct: nAtual > 0 ? (100 * n) / nAtual : 0,
        cor,
        destaque,
      };
    };

    return [
      calc(u => u.plan_B === 1, "Indicador B — Referência Estratégica Existente (Geral)", "#0163AC", true),
      calc(u => u.plan_A === 1, "Indicador A — Plano Próprio Vigente e Formalizado", "#00367C", true),
      calc(u => u.planejamento === "Adota o planejamento estratégico do tribunal", "Adota o Planejamento do Tribunal", "#3E9F9B"),
      calc(u => u.planejamento === "Em elaboração", "Plano em Elaboração", "#D9982B"),
      calc(u => u.planejamento === "Plano próprio desatualizado/vencido", "Plano Próprio Desatualizado / Vencido", "#64748B"),
      calc(u => u.planejamento === "Não possui", "Não Possui Planejamento Estratégico", "#C62828"),
    ];
  }, [unidades, nAtual]);

  const itensNormativos: ItemGrafico[] = React.useMemo(() => [
    "Plano anual de capacitação (PAC) aprovado",
    "Ato normativo / regimento interno próprio",
    "Projeto pedagógico institucional / político-pedagógico",
    "Conselho ou colegiado pedagógico / acadêmico",
    "Outro (texto livre)",
  ].map(c => itemCategoria(unidades, "instrumentos_governanca", c)), [unidades]);

  const itensDotacao: ItemGrafico[] = React.useMemo(() => [
    "Rubrica orçamentária própria",
    "Custeada por rubrica geral do tribunal",
    "Rubrica específica de capacitação gerida pelo tribunal (texto livre)",
  ].map(c => itemCategoria(unidades, "dotacao", c)), [unidades]);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#00367C", marginBottom: "0.4rem" }}>
          Governança, Normativos e Planejamento Estratégico
        </h2>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Estrutura normativa, arranjos decisórios, instrumentos de gestão e dotação orçamentária · N = {nAtual}
        </p>
      </div>

      {isSmallGroup && <SmallGroupAlert nAtual={nAtual} />}

      {/* Box de Salvaguarda Metodológica C02 sobre Planejamento */}
      <div style={{ background: "#EFF6FF", borderLeft: "4px solid #0163AC", padding: "1rem 1.25rem", borderRadius: "0 8px 8px 0", marginBottom: "2rem", fontSize: "0.88rem", color: "#1E3A8A", lineHeight: 1.5 }}>
        <strong>Decisão Metodológica C02 (§5):</strong> Os dois indicadores de planejamento estratégico <em>nunca são somados ou conflacionados</em>. O <strong>Indicador A (47,3% nacional)</strong> mede estritamente o plano próprio da unidade formalizado e vigente. O <strong>Indicador B (68,2% nacional)</strong> engloba qualquer referência estratégica (incluindo a adoção formal do plano do tribunal). Unidades que possuem apenas plano operacional anual (PAC) não são classificadas como detentoras de planejamento estratégico.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: "1.5rem" }}>
        {/* Gráfico 1: Planejamento */}
        <ChartCard
          titulo="Planejamento Estratégico Institucional"
          subtitulo="Distinção entre plano próprio formalizado e referência estratégica geral"
          itens={itensPlanejamento}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Distribuição autodeclarada das referências e instrumentos de planejamento estratégico.",
            perguntaOrigem: "Q11 do formulário (situação do planejamento estratégico).",
            denominador: `N = ${nAtual} unidades respondentes.`,
            regraCalculo: "Percentual por categoria recodificada segundo a regra C02.",
            limitacao: "Autodeclarado. Adoção do planejamento do tribunal não equivale a plano próprio da escola."
          }}
          linkRelatorio={{ capitulo: "Capítulo 4", texto: "Governança e Planejamento Estratégico" }}
        />

        {/* Gráfico 2: Normativos e Colegiados */}
        <ChartCard
          titulo="Instrumentos Normativos e Órgãos Colegiados"
          subtitulo="Presença formal de PAC, Regimento, Colegiados e Projeto Pedagógico"
          itens={itensNormativos}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Existência formal de instrumentos de suporte à gestão acadêmica.",
            perguntaOrigem: "Q12 do formulário (instrumentos formais vigentes).",
            denominador: `N = ${nAtual} unidades respondentes.`,
            regraCalculo: "Múltipla escolha: conta-se o número de respondentes com a opção assinalada.",
            limitacao: "Múltipla escolha; a soma dos percentuais não totaliza 100%."
          }}
          linkRelatorio={{ capitulo: "Capítulo 4", texto: "Instrumentos de Gestão e Órgãos Colegiados" }}
        />
      </div>

      {/* Gráfico 3: Arranjo Orçamentário */}
      <div style={{ marginTop: "1.5rem" }}>
        <ChartCard
          titulo="Arranjo da Dotação Orçamentária"
          subtitulo="Modelo orçamentário formal de custeio das atividades de capacitação"
          itens={itensDotacao}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Modalidade de dotação orçamentária para a formação.",
            perguntaOrigem: "Q13 do formulário (dotação orçamentária).",
            denominador: `N = ${nAtual} unidades respondentes.`,
            regraCalculo: "Percentual por arranjo declarado.",
            limitacao: "A existência de rubrica própria não indica necessariamente autonomia financeira plena."
          }}
          linkRelatorio={{ capitulo: "Capítulo 4", texto: "Arranjo Orçamentário das Unidades" }}
        />
      </div>
    </div>
  );
};
