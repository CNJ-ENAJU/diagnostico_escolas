import React from "react";
import { UnidadePublica, IndicadorCorte } from "../types";
import { ChartCard, ItemGrafico } from "../components/ChartCard";
import { SmallGroupAlert } from "../components/SmallGroupAlert";
import { MIN_PUBLIC_GROUP_SIZE } from "../config";
import { itemCategoria, percentual, temOpcao } from "../services/metricasCanonicas";

interface DigitalProps {
  unidades: UnidadePublica[];
  indicadores: IndicadorCorte[];
  ramoSelecionado: string;
}

export const Digital: React.FC<DigitalProps> = ({ unidades, indicadores, ramoSelecionado }) => {
  const nAtual = unidades.length;
  const isSmallGroup = nAtual < MIN_PUBLIC_GROUP_SIZE;
  const modoAbsoluto = nAtual <= 10;

  const itensAva: ItemGrafico[] = React.useMemo(() => [
    "AVA próprio",
    "AVA compartilhado com o tribunal",
    "AVA de outra instituição (ENFAM/ENAJU/outra)",
    "Sem AVA",
  ].map(c => itemCategoria(unidades, "ava", c)), [unidades]);

  const itensCapacidadeEad: ItemGrafico[] = React.useMemo(() => [
    "Equipe multidisciplinar dedicada, com designer instrucional, audiovisual e TI",
    "Produção parcial, com apoio pontual de outras áreas",
    "Não há capacidade própria de produção",
  ].map(c => itemCategoria(unidades, "capacidade_ead", c)), [unidades]);

  const itensTecnologias: ItemGrafico[] = React.useMemo(() => [
    "Webinários / transmissões ao vivo",
    "Salas virtuais de videoconferência",
    "Acessibilidade digital, como legendas, audiodescrição e Libras",
    "Produção própria de conteúdo digital, como videoaulas, podcasts e e-books",
    "Recursos de inteligência artificial aplicados à formação",
    "Gamificação / objetos de aprendizagem interativos",
    "Não utiliza recursos digitais estruturados",
  ].map(c => itemCategoria(unidades, "recursos_tecnologias", c)), [unidades]);

  const comAva = unidades.filter(u => u.ava !== "Sem AVA").length;
  const comMoodle = unidades.filter(u => u.moodle === 1).length;
  const comEstudio = unidades.filter(u => temOpcao(u.estrutura_fisica, "Estúdio de gravação / produção audiovisual (EaD)")).length;

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
          <div className="metric-val" style={{ color: "#D9982B" }}>{percentual(comMoodle, nAtual)}</div>
          <div className="metric-desc">Unidades que citam Moodle no questionário, considerando o total do recorte (n = {comMoodle}, N = {nAtual}).</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">Presença de AVA</div>
          <div className="metric-val" style={{ color: "#00367C" }}>{percentual(comAva, nAtual)}</div>
          <div className="metric-desc">Unidades com alguma modalidade de AVA (n = {comAva}, N = {nAtual}).</div>
        </div>

        <div className="metric-card">
          <div className="metric-header">Estúdios Audiovisuais</div>
          <div className="metric-val" style={{ color: "#0163AC" }}>{percentual(comEstudio, nAtual)}</div>
          <div className="metric-desc">Unidades que assinalaram estúdio de gravação na questão Q15 (n = {comEstudio}, N = {nAtual}).</div>
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
          linkRelatorio={{ capitulo: "Capítulo 6", texto: "Plataformas e Ambientes Virtuais" }}
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
          linkRelatorio={{ capitulo: "Capítulo 6", texto: "Capacidade de Produção de Recursos Digitais" }}
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
          linkRelatorio={{ capitulo: "Capítulo 6", texto: "Ecossistema Tecnológico do Poder Judiciário" }}
        />
      </div>
    </div>
  );
};
