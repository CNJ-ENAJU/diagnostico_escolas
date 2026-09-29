import React from "react";
import { UnidadePublica, IndicadorCorte } from "../types";
import { ChartCard, ItemGrafico } from "../components/ChartCard";
import { SmallGroupAlert } from "../components/SmallGroupAlert";
import { MIN_PUBLIC_GROUP_SIZE } from "../config";

interface DigitalProps {
  unidades: UnidadePublica[];
  indicadores: IndicadorCorte[];
  ramoSelecionado: string;
}

export const Digital: React.FC<DigitalProps> = ({ unidades, indicadores, ramoSelecionado }) => {
  const nAtual = unidades.length;
  const isSmallGroup = nAtual < MIN_PUBLIC_GROUP_SIZE;
  const modoAbsoluto = nAtual <= 10;

  // 1. Disponibilidade de AVA
  const itensAva: ItemGrafico[] = React.useMemo(() => {
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
      calc(u => u.ava.includes("próprio"), "AVA próprio da unidade", "#00367C"),
      calc(u => u.ava.includes("compartilhado"), "AVA compartilhado com o tribunal", "#0163AC"),
      calc(u => u.ava.includes("outra instituição"), "AVA de outra instituição (ENFAM, ENAJU, outro)", "#009BD4"),
      calc(u => u.ava === "Sem AVA", "Sem AVA", "#C62828"),
    ];
  }, [unidades, nAtual]);

  // 2. Capacidade de Produção EaD
  const itensCapacidadeEad: ItemGrafico[] = React.useMemo(() => {
    const calc = (termo: string, rotulo: string, cor: string): ItemGrafico => {
      const n = unidades.filter(u => u.capacidade_ead.includes(termo)).length;
      return {
        rotulo,
        n,
        N: nAtual,
        pct: nAtual > 0 ? (100 * n) / nAtual : 0,
        cor,
      };
    };

    return [
      calc("Produção parcial", "Produção parcial (com apoio pontual de outras áreas)", "#0163AC"),
      calc("Equipe multidisciplinar", "Equipe multidisciplinar dedicada (DI, TI, Audiovisual)", "#00367C"),
      calc("Não há capacidade", "Não há capacidade própria de produção de EaD", "#D9982B"),
    ];
  }, [unidades, nAtual]);

  // 3. Recursos Tecnológicos Empregados
  const itensTecnologias: ItemGrafico[] = React.useMemo(() => {
    const contarTec = (termo: string, rotulo: string, cor: string): ItemGrafico => {
      const n = unidades.filter(u => u.recursos_tecnologias.includes(termo)).length;
      return {
        rotulo,
        n,
        N: nAtual,
        pct: nAtual > 0 ? (100 * n) / nAtual : 0,
        cor,
      };
    };

    return [
      contarTec("Videoconferência", "Plataformas de Videoconferência (Zoom, Teams, Meet)", "#00367C"),
      contarTec("Ambiente Virtual", "Ambientes Virtuais de Aprendizagem (LMS)", "#0163AC"),
      contarTec("Transmissão", "Transmissão ao vivo / Webinários", "#009BD4"),
      contarTec("Repositório", "Repositórios digitais de conteúdo", "#3E9F9B"),
      contarTec("Simuladores", "Simuladores / Ferramentas interativas de aprendizagem", "#64748B"),
      contarTec("Inteligência artificial", "Ferramentas baseadas em Inteligência Artificial", "#D9982B"),
    ];
  }, [unidades, nAtual]);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#00367C", marginBottom: "0.4rem" }}>
          Ecossistema Digital & Capacidade de Produção EaD
        </h2>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Plataformas virtuais, liderança do Moodle, equipes multidisciplinares e recursos tecnológicos · N = {nAtual}
        </p>
      </div>

      {isSmallGroup && <SmallGroupAlert nAtual={nAtual} />}

      {/* Destaque Moodle */}
      <div className="card-grid" style={{ marginBottom: "2rem" }}>
        <div className="metric-card">
          <div className="metric-header">Adoção do Moodle</div>
          <div className="metric-val" style={{ color: "#D9982B" }}>90,0%</div>
          <div className="metric-desc">Das unidades que utilizam AVA declaram o software livre Moodle como ambiente principal.</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">Presença de AVA</div>
          <div className="metric-val" style={{ color: "#00367C" }}>95,5%</div>
          <div className="metric-desc">Das unidades operam com suporte de Ambiente Virtual de Aprendizagem formal.</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">Estúdios Audiovisuais</div>
          <div className="metric-val" style={{ color: "#0163AC" }}>56,4%</div>
          <div className="metric-desc">Das unidades possuem estúdio próprio ou compartilhado para gravação de aulas.</div>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: "1.5rem" }}>
        {/* Gráfico 1: Tipo de AVA */}
        <ChartCard
          titulo="Disponibilidade e Modelo de AVA"
          subtitulo="Estrutura de hospedagem e gestão dos Ambientes Virtuais de Aprendizagem"
          itens={itensAva}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Tipo de arranjo tecnológico adotado para o AVA.",
            perguntaOrigem: "Q26 do questionário (disponibilidade de AVA).",
            denominador: `N = ${nAtual} unidades respondentes.`,
            regraCalculo: "Percentual por arranjo de AVA.",
            limitacao: "Autodeclarado."
          }}
          linkRelatorio={{ capitulo: "Capítulo 7", texto: "Plataformas e Ambientes Virtuais" }}
        />

        {/* Gráfico 2: Capacidade EaD */}
        <ChartCard
          titulo="Capacidade Institucional de Produção EaD"
          subtitulo="Estrutura humana e tecnológica para concepção de conteúdos virtuais"
          itens={itensCapacidadeEad}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Grau de autonomia e especialização da equipe na produção de cursos EaD.",
            perguntaOrigem: "Q29 do formulário (capacidade de produção EaD).",
            denominador: `N = ${nAtual} unidades respondentes.`,
            regraCalculo: "Percentual por modelo de equipe declarada.",
            limitacao: "A presença de equipe multidisciplinar não quantifica o volume de produção."
          }}
          linkRelatorio={{ capitulo: "Capítulo 7", texto: "Capacidade de Produção de Recursos Digitais" }}
        />
      </div>

      {/* Gráfico 3: Recursos Tecnológicos */}
      <div style={{ marginTop: "1.5rem" }}>
        <ChartCard
          titulo="Recursos Tecnológicos Utilizados na Formação"
          subtitulo="Ferramentas digitais integradas aos processos de ensino e aprendizagem"
          itens={itensTecnologias}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Tecnologias declaradas pelas unidades no suporte educacional.",
            perguntaOrigem: "Q28 do formulário (recursos tecnológicos).",
            denominador: `N = ${nAtual} unidades respondentes.`,
            regraCalculo: "Múltipla escolha (respondente com a opção assinalada).",
            limitacao: "Múltipla escolha; percentuais não somam 100%."
          }}
          linkRelatorio={{ capitulo: "Capítulo 7", texto: "Ecossistema Tecnológico do Poder Judiciário" }}
        />
      </div>
    </div>
  );
};
