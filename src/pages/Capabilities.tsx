import React from "react";
import { UnidadePublica, IndicadorCorte } from "../types";
import { ChartCard, ItemGrafico } from "../components/ChartCard";
import { SmallGroupAlert } from "../components/SmallGroupAlert";
import { MIN_PUBLIC_GROUP_SIZE } from "../config";

interface CapabilitiesProps {
  unidades: UnidadePublica[];
  indicadores: IndicadorCorte[];
  ramoSelecionado: string;
}

export const Capabilities: React.FC<CapabilitiesProps> = ({ unidades, indicadores, ramoSelecionado }) => {
  const nAtual = unidades.length;
  const isSmallGroup = nAtual < MIN_PUBLIC_GROUP_SIZE;
  const modoAbsoluto = nAtual <= 10;

  // 1. Estrutura Física Instalada
  const itensEstrutura: ItemGrafico[] = React.useMemo(() => {
    const contarEst = (termo: string, rotulo: string, cor: string): ItemGrafico => {
      const n = unidades.filter(u => u.estrutura_fisica.includes(termo)).length;
      return {
        rotulo,
        n,
        N: nAtual,
        pct: nAtual > 0 ? (100 * n) / nAtual : 0,
        cor,
      };
    };

    return [
      contarEst("Salas de aula", "Salas de aula / treinamento", "#00367C"),
      contarEst("Auditório", "Auditório (disponibilidade declarada)", "#0163AC"),
      contarEst("Estúdio", "Estúdio de gravação audiovisual / EaD", "#009BD4"),
      contarEst("Sede", "Sede / espaço físico próprio e exclusivo", "#3E9F9B"),
      contarEst("Biblioteca", "Biblioteca / centro de memória", "#64748B"),
      contarEst("Laboratório", "Laboratório de informática", "#D9982B"),
      contarEst("Não dispõe", "Não dispõe de espaço físico dedicado (usa do tribunal)", "#C62828"),
    ];
  }, [unidades, nAtual]);

  // 2. Quadro de Servidores Efetivos (Faixas Originais)
  const itensEfetivos: ItemGrafico[] = React.useMemo(() => {
    const faixas = ["Mais de 10", "4 a 10", "1 a 3", "Nenhum"];
    const cores = ["#00367C", "#0163AC", "#009BD4", "#94A3B8"];
    return faixas.map((f, i) => {
      const n = unidades.filter(u => u.efetivos_faixa === f).length;
      return {
        rotulo: `${f} servidores efetivos`,
        n,
        N: nAtual,
        pct: nAtual > 0 ? (100 * n) / nAtual : 0,
        cor: cores[i],
      };
    });
  }, [unidades, nAtual]);

  // 3. Faixas de Orçamento 2025 Autodeclarado (Faixas Originais)
  const itensOrcamento: ItemGrafico[] = React.useMemo(() => {
    const faixas = [
      "Acima de R$ 5 mi",
      "R$ 1 mi a R$ 5 mi",
      "R$ 250 mil a R$ 1 mi",
      "Até R$ 250 mil",
      "Sem informação consolidada",
    ];
    const cores = ["#00367C", "#0163AC", "#009BD4", "#3E9F9B", "#94A3B8"];
    return faixas.map((f, i) => {
      const n = unidades.filter(u => u.orcamento_faixa === f).length;
      return {
        rotulo: f,
        n,
        N: nAtual,
        pct: nAtual > 0 ? (100 * n) / nAtual : 0,
        cor: cores[i],
      };
    });
  }, [unidades, nAtual]);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#00367C", marginBottom: "0.4rem" }}>
          Capacidades Instaladas: Estrutura, Pessoal e Orçamento
        </h2>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Infraestrutura física, quadro de servidores e faixas orçamentárias autodeclaradas · N = {nAtual}
        </p>
      </div>

      {isSmallGroup && <SmallGroupAlert nAtual={nAtual} />}

      {/* Alerta Metodológico Obrigatório (Regra 18) */}
      <div style={{ background: "#F8FAFC", borderLeft: "4px solid #D9982B", padding: "1rem 1.25rem", borderRadius: "0 8px 8px 0", marginBottom: "2rem", fontSize: "0.85rem", color: "#334155", lineHeight: 1.5 }}>
        <strong>Salvaguarda Metodológica (Capítulo 5 do Relatório):</strong> As variáveis de pessoal e orçamento foram coletadas em <em>faixas ordinais autodeclaradas</em>. Por determinação metodológica, é vedado o cálculo de médias artificiais, extrapolações de pontos médios ou somas do total nacional de servidores/orçamento, pois tais operações induzem a estimativas enviesadas.
      </div>

      {/* Gráfico 1: Estrutura Física */}
      <div style={{ marginBottom: "2rem" }}>
        <ChartCard
          titulo="Estrutura Física Instalada"
          subtitulo="Espaços e instalações disponíveis para suporte às ações educacionais"
          itens={itensEstrutura}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Disponibilidade de espaços físicos e instalações nas unidades de formação.",
            perguntaOrigem: "Q15 do formulário (estrutura física).",
            denominador: `N = ${nAtual} unidades respondentes.`,
            regraCalculo: "Múltipla escolha (respondente com a opção assinalada).",
            limitacao: "Valores autodeclarados; a soma dos percentuais não totaliza 100%."
          }}
          linkRelatorio={{ capitulo: "Capítulo 5", texto: "Capacidades Físicas e Estruturais" }}
        />
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: "1.5rem" }}>
        {/* Gráfico 2: Pessoal Efetivo */}
        <ChartCard
          titulo="Quadro de Servidores Efetivos (Faixas Ordinais)"
          subtitulo="Distribuição por faixa de servidores efetivos lotados na unidade"
          itens={itensEfetivos}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Distribuição do quadro de pessoal permanente das unidades.",
            perguntaOrigem: "Q16 do formulário (faixa de servidores efetivos).",
            denominador: `N = ${nAtual} unidades respondentes.`,
            regraCalculo: "Percentual de unidades em cada faixa ordinal.",
            limitacao: "Faixas ordinais; não reflete a soma exata de servidores."
          }}
          linkRelatorio={{ capitulo: "Capítulo 5", texto: "Força de Trabalho e Quadro Funcional" }}
        />

        {/* Gráfico 3: Orçamento 2025 */}
        <ChartCard
          titulo="Orçamento Executado em 2025 (Autodeclarado)"
          subtitulo="Distribuição por faixas ordinais de execução financeira"
          itens={itensOrcamento}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Faixas orçamentárias declaradas pelas unidades para o exercício 2025.",
            perguntaOrigem: "Q14 do formulário (faixa orçamentária).",
            denominador: `N = ${nAtual} unidades respondentes.`,
            regraCalculo: "Percentual de unidades em cada faixa ordinal.",
            limitacao: "Valores autodeclarados sem conferência contábil-documental nesta versão."
          }}
          linkRelatorio={{ capitulo: "Capítulo 5", texto: "Recursos Financeiros e Orçamento" }}
        />
      </div>
    </div>
  );
};
