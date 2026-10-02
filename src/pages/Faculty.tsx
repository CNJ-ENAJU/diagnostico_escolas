import React from "react";
import { UnidadePublica, IndicadorCorte } from "../types";
import { ChartCard, ItemGrafico } from "../components/ChartCard";
import { SmallGroupAlert } from "../components/SmallGroupAlert";
import { MIN_PUBLIC_GROUP_SIZE } from "../config";
import { itemCategoria, percentual } from "../services/metricasCanonicas";

interface FacultyProps {
  unidades: UnidadePublica[];
  indicadores: IndicadorCorte[];
  ramoSelecionado: string;
}

export const Faculty: React.FC<FacultyProps> = ({ unidades, indicadores, ramoSelecionado }) => {
  const nAtual = unidades.length;
  const isSmallGroup = nAtual < MIN_PUBLIC_GROUP_SIZE;
  const modoAbsoluto = nAtual <= 10;

  const itensFormacao: ItemGrafico[] = React.useMemo(() => [
    "Programa permanente com certificação",
    "Ações pontuais",
    "Não desenvolve",
    "Participação em programa/eventos externos (texto livre)",
    "Outro texto livre, não classificável",
    "Não se aplica (texto livre)",
  ].map(c => itemCategoria(unidades, "formacao_formadores", c)), [unidades]);

  const itensComposicao: ItemGrafico[] = React.useMemo(() => [
    "Servidores(as) da própria instituição",
    "Magistrados(as) da própria instituição",
    "Docentes externos / convidados",
    "Profissionais de outras instituições públicas",
    "Docentes de instituições de ensino superior",
  ].map(c => itemCategoria(unidades, "composicao_docente", c)), [unidades]);

  const itensGestao: ItemGrafico[] = React.useMemo(() => [
    "Política de retribuição / gratificação por hora-aula",
    "Banco / cadastro de formadores",
    "Avaliação de desempenho dos formadores",
    "Critérios formais de seleção e credenciamento",
    "Nenhum dos anteriores",
    "Outro (texto livre)",
  ].map(c => itemCategoria(unidades, "instrumentos_gestao_docente", c)), [unidades]);

  const nCadastro = unidades.filter(u => u.cadastro_formadores === "Sim").length;
  const nPermanente = unidades.filter(u => u.formacao_formadores === "Programa permanente com certificação").length;
  const nPontual = unidades.filter(u => u.formacao_formadores === "Ações pontuais").length;

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
          <div className="metric-val" style={{ color: "#00367C" }}>{percentual(nCadastro, nAtual)}</div>
          <div className="metric-desc">Responderam “Sim” à Q33 (cadastro atualizado). O instrumento de banco/cadastro de Q34 é medida distinta.</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">Programa Permanente</div>
          <div className="metric-val" style={{ color: "#0163AC" }}>{percentual(nPermanente, nAtual)}</div>
          <div className="metric-desc">Possuem política estruturada e permanente de formação continuada para docentes.</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">Ações Pontuais</div>
          <div className="metric-val" style={{ color: "#D9982B" }}>{percentual(nPontual, nAtual)}</div>
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
          linkRelatorio={{ capitulo: "Capítulo 7", texto: "Formação Continuada de Docentes" }}
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
          linkRelatorio={{ capitulo: "Capítulo 7", texto: "Perfil e Origem do Corpo Docente" }}
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
          linkRelatorio={{ capitulo: "Capítulo 7", texto: "Instrumentos de Gestão de Formadores" }}
        />
      </div>
    </div>
  );
};
