import React from "react";
import { UnidadePublica, IndicadorCorte } from "../types";
import { ChartCard, ItemGrafico } from "../components/ChartCard";
import { SmallGroupAlert } from "../components/SmallGroupAlert";
import { MIN_PUBLIC_GROUP_SIZE } from "../config";

interface EvaluationProps {
  unidades: UnidadePublica[];
  indicadores: IndicadorCorte[];
  ramoSelecionado: string;
}

export const Evaluation: React.FC<EvaluationProps> = ({ unidades, indicadores, ramoSelecionado }) => {
  const nAtual = unidades.length;
  const isSmallGroup = nAtual < MIN_PUBLIC_GROUP_SIZE;
  const modoAbsoluto = nAtual <= 10;

  // 1. Qualquer Aplicação nos Níveis de Kirkpatrick (Variável Derivada Auxiliar C02 §6)
  const itensQualquerAplicacao: ItemGrafico[] = React.useMemo(() => {
    const calc = (nivelKey: keyof UnidadePublica, rotulo: string, cor: string): ItemGrafico => {
      const n = unidades.filter(u => u[nivelKey] === "Na maioria das ações" || u[nivelKey] === "Em parte das ações").length;
      return {
        rotulo,
        n,
        N: nAtual,
        pct: nAtual > 0 ? (100 * n) / nAtual : 0,
        cor,
      };
    };

    return [
      calc("n1_reacao", "Nível 1 — Reação (Satisfação imediata dos cursistas)", "#00367C"),
      calc("n2_aprendizagem", "Nível 2 — Aprendizagem (Aquisição de conhecimentos e habilidades)", "#0163AC"),
      calc("n3_transferencia", "Nível 3 — Transferência (Aplicação prática no ambiente de trabalho)", "#009BD4"),
      calc("n4_impacto", "Nível 4 — Impacto (Mudanças e resultados organizacionais)", "#3E9F9B"),
    ];
  }, [unidades, nAtual]);

  // 2. Aplicação na Maioria das Ações (Intensidade Avaliativa)
  const itensMaioriaAcoes: ItemGrafico[] = React.useMemo(() => {
    const calc = (nivelKey: keyof UnidadePublica, rotulo: string, cor: string): ItemGrafico => {
      const n = unidades.filter(u => u[nivelKey] === "Na maioria das ações").length;
      return {
        rotulo,
        n,
        N: nAtual,
        pct: nAtual > 0 ? (100 * n) / nAtual : 0,
        cor,
      };
    };

    return [
      calc("n1_reacao", "Nível 1 — Reação (Aplicado na maioria das ações)", "#00367C"),
      calc("n2_aprendizagem", "Nível 2 — Aprendizagem (Aplicado na maioria das ações)", "#0163AC"),
      calc("n3_transferencia", "Nível 3 — Transferência (Aplicado na maioria das ações)", "#009BD4"),
      calc("n4_impacto", "Nível 4 — Impacto (Aplicado na maioria das ações)", "#3E9F9B"),
    ];
  }, [unidades, nAtual]);

  // 3. Pesquisa com Egressos
  const itensEgressos: ItemGrafico[] = React.useMemo(() => {
    const calc = (cond: (u: UnidadePublica) => boolean, rotulo: string, cor: string): ItemGrafico => {
      const n = unidades.filter(cond).length;
      return {
        rotulo,
        n,
        N: nAtual,
        pct: nAtual > 0 ? (100 * n) / nAtual : 0,
        cor,
      };
    };

    return [
      calc(u => u.egressos.includes("Não realiza"), "Não realiza pesquisa com egressos", "#64748B"),
      calc(u => u.egressos.includes("pontual"), "Realiza de forma pontual", "#0163AC"),
      calc(u => u.egressos.includes("sistemática"), "Realiza de forma sistemática", "#00367C"),
    ];
  }, [unidades, nAtual]);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#00367C", marginBottom: "0.4rem" }}>
          Avaliação da Formação & Modelo de Kirkpatrick
        </h2>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Aferição dos 4 níveis de eficácia formativa, coerência avaliativa e acompanhamento de egressos · N = {nAtual}
        </p>
      </div>

      {isSmallGroup && <SmallGroupAlert nAtual={nAtual} />}

      {/* Alerta Metodológico: Escada Avaliativa (Regra 21) */}
      <div style={{ background: "#F8FAFC", borderLeft: "4px solid #00367C", padding: "1rem 1.25rem", borderRadius: "0 8px 8px 0", marginBottom: "2rem", fontSize: "0.85rem", color: "#334155", lineHeight: 1.5 }}>
        <strong>Nota Metodológica (Capítulo 9 do Relatório):</strong> As opções do questionário preservam três graus ordinais (<em>Não aplica</em>, <em>Em parte das ações</em> e <em>Na maioria das ações</em>). A representação é apresentada tanto para "qualquer aplicação" quanto para "aplicação sistemática na maioria das ações". Evita-se representação exclusiva em funil para não pressupor uma linearidade obrigatória entre todos os níveis em todas as ações formativas.
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: "1.5rem" }}>
        {/* Gráfico 1: Qualquer Aplicação */}
        <ChartCard
          titulo="A Escada de Kirkpatrick: Qualquer Aplicação"
          subtitulo="Unidades que aplicam o nível ao menos em parte das ações formativas"
          itens={itensQualquerAplicacao}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Presença de cada nível de avaliação de Kirkpatrick (N1 Reação a N4 Impacto).",
            perguntaOrigem: "Q37 do formulário oficial (itens de avaliação por nível).",
            denominador: `N = ${nAtual} unidades respondentes.`,
            regraCalculo: "Soma das opções 'Em parte das ações' e 'Na maioria das ações'.",
            limitacao: "Autodeclarado."
          }}
          linkRelatorio={{ capitulo: "Capítulo 9", texto: "A Escada Avaliativa de Kirkpatrick" }}
        />

        {/* Gráfico 2: Aplicação na Maioria das Ações */}
        <ChartCard
          titulo="Avaliação Sistemática: Aplicação na Maioria das Ações"
          subtitulo="Grau de consolidação rotineira das práticas avaliativas"
          itens={itensMaioriaAcoes}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Unidades que executam a avaliação de forma sistemática na quase totalidade das ações.",
            perguntaOrigem: "Q37 do formulário oficial.",
            denominador: `N = ${nAtual} unidades respondentes.`,
            regraCalculo: "Percentual exclusivo da categoria 'Na maioria das ações'.",
            limitacao: "Critérios de delimitação de 'maioria' autodeclarados pelas unidades."
          }}
          linkRelatorio={{ capitulo: "Capítulo 9", texto: "Intensidade Avaliativa por Ramo" }}
        />
      </div>

      {/* Gráfico 3: Acompanhamento de Egressos */}
      <div style={{ marginTop: "1.5rem" }}>
        <ChartCard
          titulo="Acompanhamento e Pesquisa de Impacto com Egressos"
          subtitulo="Monitoramento do impacto da formação ao longo do tempo pós-curso"
          itens={itensEgressos}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Realização de estudos longitudinais e pesquisas com ex-alunos.",
            perguntaOrigem: "Q38 do questionário oficial.",
            denominador: `N = ${nAtual} unidades respondentes.`,
            regraCalculo: "Percentual por arranjo de pesquisa declarado.",
            limitacao: "Autodeclarado."
          }}
          linkRelatorio={{ capitulo: "Capítulo 9", texto: "Pesquisa de Egressos e Impacto Organizacional" }}
        />
      </div>
    </div>
  );
};
