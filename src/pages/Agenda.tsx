import React from "react";
import { UnidadePublica, IndicadorCorte } from "../types";
import { ChartCard, ItemGrafico } from "../components/ChartCard";
import { SmallGroupAlert } from "../components/SmallGroupAlert";
import { MIN_PUBLIC_GROUP_SIZE } from "../config";
import { itemCategoria } from "../services/metricasCanonicas";

interface AgendaProps {
  unidades: UnidadePublica[];
  indicadores: IndicadorCorte[];
  ramoSelecionado: string;
}

export const Agenda: React.FC<AgendaProps> = ({ unidades, indicadores, ramoSelecionado }) => {
  const nAtual = unidades.length;
  const isSmallGroup = nAtual < MIN_PUBLIC_GROUP_SIZE;
  const modoAbsoluto = nAtual <= 10;

  // Categorias textuais idênticas às perguntas Q23 e Q31 e à camada pública homologada.
  // Correspondência exata após separação por ponto e vírgula; nenhum eixo novo é inferido.
  const temas2025 = [
    "Direitos humanos, cidadania e inclusão social",
    "Diversidade, igualdade e não discriminação",
    "Direito, processo e atuação jurisdicional",
    "Tecnologia, governo digital e inovação no setor público",
    "Gestão de pessoas, liderança e desenvolvimento de equipes",
    "Sustentabilidade, meio ambiente e mudanças climáticas",
    "Saúde, bem-estar e qualidade de vida no trabalho",
    "Dados, informação, privacidade e proteção de dados pessoais",
    "Governança pública, gestão estratégica e resultados",
    "Comunicação institucional, linguagem clara e relacionamento com a sociedade",
    "Acesso à justiça, atendimento ao público e humanização",
    "Meios consensuais de solução de conflitos e justiça restaurativa",
    "Ética, integridade, transparência e controle social",
    "Competências comportamentais e socioemocionais",
    "Educação, docência e formação de formadores",
    "Gestão de projetos, processos e melhoria contínua",
    "Políticas públicas, planejamento e avaliação",
    "Outro (texto livre)",
  ];

  const eixos2026 = [
    "Direitos humanos, diversidade e inclusão",
    "Inteligência artificial e inovação no Judiciário",
    "Gestão judiciária e produtividade",
    "Proteção de dados, privacidade e prova digital",
    "Saúde mental e qualidade de vida",
    "Métodos consensuais e justiça restaurativa",
    "Formação inicial de magistrados",
    "Combate ao crime organizado e atuação criminal",
    "Outro (texto livre)",
  ];

  const itensTemas2025: ItemGrafico[] = React.useMemo(() =>
    temas2025.map(categoria => itemCategoria(unidades, "tematicas_2025", categoria))
      .sort((a, b) => b.n - a.n), [unidades]
  );
  const itensEixos2026: ItemGrafico[] = React.useMemo(() =>
    eixos2026.map(categoria => itemCategoria(unidades, "eixos_prioritarios_2026", categoria, categoria, "#00367C"))
      .sort((a, b) => b.n - a.n), [unidades]
  );

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#00367C", marginBottom: "0.4rem" }}>
          Agenda Formativa: Temáticas 2025 & Eixos Prioritários 2026
        </h2>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Dois retratos descritivos independentes: temas de 2025 e prioridades de 2026 · N = {nAtual}
        </p>
      </div>

      {isSmallGroup && <SmallGroupAlert nAtual={nAtual} />}

      {/* Alerta Metodológico Obrigatório de Não-Comparabilidade (Regra 22) */}
      <div style={{ background: "#FEF3C7", borderLeft: "4px solid #D97706", padding: "1.25rem", borderRadius: "0 8px 8px 0", marginBottom: "2rem", fontSize: "0.88rem", color: "#92400E", lineHeight: 1.5 }}>
        <strong>Alerta Metodológico Crítico (Capítulo 9 do Relatório):</strong> As perguntas de 2025 e 2026 utilizaram listas, agrupamentos e regras de resposta distintas (em 2026 vigorou limitação de no máximo 5 eixos prioritários por unidade). <em>Os resultados não constituem série temporal e não devem ser interpretados como crescimento ou redução entre os anos. A categoria “Outro” em 2026 inclui temas eleitorais que não constavam da lista fechada.</em>
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
          linkRelatorio={{ capitulo: "Capítulo 9", texto: "Temáticas de Capacitação em 2025" }}
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
          linkRelatorio={{ capitulo: "Capítulo 9", texto: "Eixos Prioritários para 2026" }}
        />
      </div>
    </div>
  );
};
