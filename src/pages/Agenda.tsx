import React from "react";
import { UnidadePublica, IndicadorCorte } from "../types";
import { ChartCard, ItemGrafico } from "../components/ChartCard";
import { SmallGroupAlert } from "../components/SmallGroupAlert";
import { MIN_PUBLIC_GROUP_SIZE } from "../config";

interface AgendaProps {
  unidades: UnidadePublica[];
  indicadores: IndicadorCorte[];
  ramoSelecionado: string;
}

export const Agenda: React.FC<AgendaProps> = ({ unidades, indicadores, ramoSelecionado }) => {
  const nAtual = unidades.length;
  const isSmallGroup = nAtual < MIN_PUBLIC_GROUP_SIZE;
  const modoAbsoluto = nAtual <= 10;

  // 1. Temáticas Realizadas em 2025 (Lista de 17 Áreas)
  const itensTemas2025: ItemGrafico[] = React.useMemo(() => {
    const contarTema = (termo: string, rotulo: string): ItemGrafico => {
      const n = unidades.filter(u => u.tematicas_2025.includes(termo)).length;
      return {
        rotulo,
        n,
        N: nAtual,
        pct: nAtual > 0 ? (100 * n) / nAtual : 0,
        cor: "#0163AC",
      };
    };

    return [
      contarTema("Tecnologia da informação", "Tecnologia da Informação e Inovação"),
      contarTema("Gestão de pessoas", "Gestão de Pessoas e Liderança"),
      contarTema("Direito processual", "Direito Processual"),
      contarTema("Direitos humanos", "Direitos Humanos e Vulnerabilidades"),
      contarTema("Ética", "Ética, Integridade e Prevenção ao Assédio"),
      contarTema("Inteligência artificial", "Inteligência Artificial"),
      contarTema("Comunicação", "Comunicação e Linguagem Simples"),
      contarTema("Meio ambiente", "Sustentabilidade e Direito Ambiental"),
      contarTema("Gestão estratégica", "Gestão Estratégica e Projetos"),
      contarTema("Métodos consensuais", "Métodos Consensuais / Mediação"),
      contarTema("Direito administrativo", "Direito Administrativo e Contratações"),
      contarTema("Saúde", "Saúde e Qualidade de Vida"),
      contarTema("Outro", "Outro (texto livre)"),
    ].sort((a, b) => b.n - a.n);
  }, [unidades, nAtual]);

  // 2. Eixos Prioritários de 2026 (Lista de Eixos Estruturados)
  const itensEixos2026: ItemGrafico[] = React.useMemo(() => {
    const contarEixo = (termo: string, rotulo: string): ItemGrafico => {
      const n = unidades.filter(u => u.eixos_prioritarios_2026.includes(termo)).length;
      return {
        rotulo,
        n,
        N: nAtual,
        pct: nAtual > 0 ? (100 * n) / nAtual : 0,
        cor: "#00367C",
      };
    };

    return [
      contarEixo("Inteligência artificial", "Inteligência Artificial e Transformação Digital"),
      contarEixo("Direitos humanos", "Direitos Humanos e Proteção de Grupos Vulneráveis"),
      contarEixo("Inovação", "Inovação, Linguagem Simples e Acesso à Justiça"),
      contarEixo("Gestão", "Gestão Judiciária, Produtividade e Governança"),
      contarEixo("Sustentabilidade", "Sustentabilidade, Meio Ambiente e Clima"),
      contarEixo("Ética", "Ética, Integridade e Equidade de Gênero/Raça"),
      contarEixo("Métodos consensuais", "Métodos Consensuais e Solução de Conflitos"),
      contarEixo("Precedentes", "Sistema de Precedentes e Segurança Jurídica"),
      contarEixo("Outro", "Outro (especificado em texto livre)"),
    ].sort((a, b) => b.n - a.n);
  }, [unidades, nAtual]);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#00367C", marginBottom: "0.4rem" }}>
          Agenda Formativa: Temáticas 2025 & Eixos Prioritários 2026
        </h2>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Mapeamento comparativo das áreas pedagógicas desenvolvidas e intenções estratégicas para o próximo ciclo · N = {nAtual}
        </p>
      </div>

      {isSmallGroup && <SmallGroupAlert nAtual={nAtual} />}

      {/* Alerta Metodológico Obrigatório de Não-Comparabilidade (Regra 22) */}
      <div style={{ background: "#FEF3C7", borderLeft: "4px solid #D97706", padding: "1.25rem", borderRadius: "0 8px 8px 0", marginBottom: "2rem", fontSize: "0.88rem", color: "#92400E", lineHeight: 1.5 }}>
        <strong>Alerta Metodológico Crítico (Capítulo 10 do Relatório):</strong> As perguntas de 2025 e 2026 utilizaram listas, agrupamentos e regras de resposta distintas (em 2026 vigorou limitação de no máximo 5 eixos prioritários por unidade). <em>Os resultados não constituem série temporal e não devem ser interpretados como crescimento ou redução entre os anos.</em>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: "1.5rem" }}>
        {/* Gráfico 1: Temáticas 2025 */}
        <ChartCard
          titulo="Temáticas Desenvolvidas em 2025 (Recorrentes)"
          subtitulo="Áreas de conhecimento assinaladas como mais frequentes nas capacitações realizadas"
          itens={itensTemas2025}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Áreas temáticas com ações formativas realizadas no exercício 2025.",
            perguntaOrigem: "Q23 do formulário (temáticas desenvolvidas em 2025).",
            denominador: `N = ${nAtual} unidades respondentes.`,
            regraCalculo: "Múltipla escolha (respondente com a opção assinalada).",
            limitacao: "Múltipla escolha sem limite máximo de opções; percentuais não somam 100%."
          }}
          linkRelatorio={{ capitulo: "Capítulo 10", texto: "Temáticas de Capacitação em 2025" }}
        />

        {/* Gráfico 2: Eixos 2026 */}
        <ChartCard
          titulo="Eixos Prioritários Declarados para 2026"
          subtitulo="Prioridades curriculares planejadas para o próximo ciclo formativo"
          itens={itensEixos2026}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Eixos estratégicos prioritários para oferta educacional no ciclo 2026.",
            perguntaOrigem: "Q31 do questionário oficial (eixos prioritários 2026).",
            denominador: `N = ${nAtual} unidades respondentes.`,
            regraCalculo: "Múltipla escolha com teto de até 5 opções assinaladas por unidade.",
            limitacao: "Não comparável diretamente com 2025 devido à limitação de escolhas."
          }}
          linkRelatorio={{ capitulo: "Capítulo 10", texto: "Eixos Prioritários para 2026" }}
        />
      </div>
    </div>
  );
};
