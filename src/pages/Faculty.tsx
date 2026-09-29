import React from "react";
import { UnidadePublica, IndicadorCorte } from "../types";
import { ChartCard, ItemGrafico } from "../components/ChartCard";
import { SmallGroupAlert } from "../components/SmallGroupAlert";
import { MIN_PUBLIC_GROUP_SIZE } from "../config";

interface FacultyProps {
  unidades: UnidadePublica[];
  indicadores: IndicadorCorte[];
  ramoSelecionado: string;
}

export const Faculty: React.FC<FacultyProps> = ({ unidades, indicadores, ramoSelecionado }) => {
  const nAtual = unidades.length;
  const isSmallGroup = nAtual < MIN_PUBLIC_GROUP_SIZE;
  const modoAbsoluto = nAtual <= 10;

  // 1. Formação de Formadores
  const itensFormacao: ItemGrafico[] = React.useMemo(() => {
    const calc = (termo: string, rotulo: string, cor: string): ItemGrafico => {
      const n = unidades.filter(u => u.formacao_formadores.includes(termo)).length;
      return {
        rotulo,
        n,
        N: nAtual,
        pct: nAtual > 0 ? (100 * n) / nAtual : 0,
        cor,
      };
    };

    return [
      calc("Ações pontuais", "Ações pontuais de formação pedagógica", "#0163AC"),
      calc("Programa permanente", "Programa permanente com certificação", "#00367C"),
      calc("Não desenvolve", "Não desenvolve iniciativas de formação docente", "#C62828"),
      calc("externos", "Participação em programas externos (texto livre)", "#64748B"),
    ];
  }, [unidades, nAtual]);

  // 2. Composição do Corpo Docente
  const itensComposicao: ItemGrafico[] = React.useMemo(() => {
    const contarComp = (termo: string, rotulo: string, cor: string): ItemGrafico => {
      const n = unidades.filter(u => u.composicao_docente.includes(termo)).length;
      return {
        rotulo,
        n,
        N: nAtual,
        pct: nAtual > 0 ? (100 * n) / nAtual : 0,
        cor,
      };
    };

    return [
      contarComp("Magistrados", "Magistrados(as) do próprio tribunal ou de outros órgãos", "#00367C"),
      contarComp("Servidores", "Servidores(as) efetivos com atuação docente", "#0163AC"),
      contarComp("externos", "Docentes e especialistas externos convidados/contratados", "#009BD4"),
    ];
  }, [unidades, nAtual]);

  // 3. Instrumentos de Gestão Docente
  const itensGestao: ItemGrafico[] = React.useMemo(() => {
    const contarGest = (termo: string, rotulo: string, cor: string): ItemGrafico => {
      const n = unidades.filter(u => u.instrumentos_gestao_docente.includes(termo)).length;
      return {
        rotulo,
        n,
        N: nAtual,
        pct: nAtual > 0 ? (100 * n) / nAtual : 0,
        cor,
      };
    };

    return [
      contarGest("Retribuição", "Norma regulamentadora de retribuição financeira (GECC)", "#00367C"),
      contarGest("Banco de talentos", "Banco de talentos / Cadastro de formadores atualizado", "#0163AC"),
      contarGest("Avaliação de desempenho", "Avaliação formal de desempenho didático-pedagógico", "#009BD4"),
      contarGest("Edital", "Seleção de formadores por edital público de credenciamento", "#3E9F9B"),
    ];
  }, [unidades, nAtual]);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#00367C", marginBottom: "0.4rem" }}>
          Corpo Docente & Formação de Formadores
        </h2>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Composição docente, instrumentos de seleção, retribuição e capacitação pedagógica continuada · N = {nAtual}
        </p>
      </div>

      {isSmallGroup && <SmallGroupAlert nAtual={nAtual} />}

      {/* Cards de Destaque */}
      <div className="card-grid" style={{ marginBottom: "2rem" }}>
        <div className="metric-card">
          <div className="metric-header">Cadastro Atualizado</div>
          <div className="metric-val" style={{ color: "#00367C" }}>70,9%</div>
          <div className="metric-desc">Das unidades contam com cadastro sistemático ou banco de talentos de formadores.</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">Programa Permanente</div>
          <div className="metric-val" style={{ color: "#0163AC" }}>30,9%</div>
          <div className="metric-desc">Possuem política estruturada e permanente de formação continuada para docentes.</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">Ações Pontuais</div>
          <div className="metric-val" style={{ color: "#D9982B" }}>46,4%</div>
          <div className="metric-desc">Desenvolvem capacitação pedagógica de forma esporádica ou sob demanda.</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: "1.5rem" }}>
        {/* Gráfico 1: Formação de Formadores */}
        <ChartCard
          titulo="Iniciativas de Formação de Formadores"
          subtitulo="Políticas de desenvolvimento de competências didático-pedagógicas"
          itens={itensFormacao}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Modalidade de iniciativas de formação pedagógica ofertadas aos docentes.",
            perguntaOrigem: "Q35 do formulário oficial (programa de formação de formadores).",
            denominador: `N = ${nAtual} unidades respondentes.`,
            regraCalculo: "Percentual por arranjo declarado.",
            limitacao: "Autodeclarado."
          }}
          linkRelatorio={{ capitulo: "Capítulo 8", texto: "Formação Continuada de Docentes" }}
        />

        {/* Gráfico 2: Composição Docente */}
        <ChartCard
          titulo="Composição do Corpo Docente"
          subtitulo="Segmentos de origem dos profissionais que ministram cursos"
          itens={itensComposicao}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Segmentos que compõem o quadro de formadores das unidades.",
            perguntaOrigem: "Q32 do formulário oficial.",
            denominador: `N = ${nAtual} unidades respondentes.`,
            regraCalculo: "Múltipla escolha (respondente com a opção assinalada).",
            limitacao: "Múltipla escolha; percentuais não somam 100%."
          }}
          linkRelatorio={{ capitulo: "Capítulo 8", texto: "Perfil e Origem do Corpo Docente" }}
        />
      </div>

      {/* Gráfico 3: Instrumentos de Gestão Docente */}
      <div style={{ marginTop: "1.5rem" }}>
        <ChartCard
          titulo="Instrumentos Formais de Gestão Docente"
          subtitulo="Mecanismos de retribuição financeira, credenciamento e avaliação de desempenho"
          itens={itensGestao}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Existência de atos e critérios regulamentares de gestão de formadores.",
            perguntaOrigem: "Q34 do questionário oficial.",
            denominador: `N = ${nAtual} unidades respondentes.`,
            regraCalculo: "Múltipla escolha (respondente com a opção assinalada).",
            limitacao: "Múltipla escolha; percentuais não somam 100%."
          }}
          linkRelatorio={{ capitulo: "Capítulo 8", texto: "Instrumentos de Gestão de Formadores" }}
        />
      </div>
    </div>
  );
};
