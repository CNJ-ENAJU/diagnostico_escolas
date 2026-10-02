import React from "react";
import { UnidadePublica, IndicadorCorte } from "../types";
import { ChartCard, ItemGrafico } from "../components/ChartCard";
import { SmallGroupAlert } from "../components/SmallGroupAlert";
import { MIN_PUBLIC_GROUP_SIZE } from "../config";
import { percentualNacional, temOpcao } from "../services/metricasCanonicas";
import { CheckCircle2, Shield, Laptop, Users, GraduationCap, Handshake } from "lucide-react";

interface OverviewProps {
  unidades: UnidadePublica[];
  indicadores: IndicadorCorte[];
  ramoSelecionado: string;
}

export const Overview: React.FC<OverviewProps> = ({ unidades, indicadores, ramoSelecionado }) => {
  const nAtual = unidades.length;
  const isSmallGroup = nAtual < MIN_PUBLIC_GROUP_SIZE;
  const modoAbsoluto = nAtual <= 10;

  // 12 Indicadores Estratégicos Nacionais
  const itensEstrategicos: ItemGrafico[] = React.useMemo(() => {
    // Se estiver filtrado, calcula a partir das unidades filtradas; se for Nacional, usa a base homologada
    const calc = (condicao: (u: UnidadePublica) => boolean, rotulo: string, cor?: string): ItemGrafico => {
      const n = unidades.filter(condicao).length;
      return {
        rotulo,
        n,
        N: nAtual,
        pct: nAtual > 0 ? (100 * n) / nAtual : 0,
        cor: cor || "#0163AC",
      };
    };

    return [
      calc(u => u.interesse_enaju === "Alto" || u.interesse_enaju === "Moderado", "1. Interesse Positivo em Rede com a ENAJU/CNJ", "#2E7D32"),
      calc(u => u.n1_reacao === "Na maioria das ações" || u.n1_reacao === "Em parte das ações", "2. Avaliação de Nível 1 — Reação", "#0163AC"),
      calc(u => u.ava !== "Sem AVA", "3. Disponibilidade de Ambiente Virtual (AVA)", "#00367C"),
      calc(u => u.natureza === "Escola formalmente instituída", "4. Natureza Formal de Escola Judicial", "#074B9E"),
      calc(u => temOpcao(u.instrumentos_governanca, "Plano anual de capacitação (PAC) aprovado"), "5. Plano Anual de Capacitação (PAC) Vigente", "#009BD4"),
      calc(u => u.n2_aprendizagem === "Na maioria das ações" || u.n2_aprendizagem === "Em parte das ações", "6. Avaliação de Nível 2 — Aprendizagem", "#0163AC"),
      calc(u => u.cadastro_formadores === "Sim", "7. Cadastro de Formadores / Banco de Talentos", "#3E9F9B"),
      calc(u => u.plan_B === 1, "8. Indicador B — Referência Estratégica Existente", "#D9982B"),
      calc(u => u.parcerias === "Sim, com convênios/acordos vigentes", "9. Parcerias Formais / Convênios Vigentes", "#3E9F9B"),
      calc(u => temOpcao(u.estrutura_fisica, "Auditório"), "10. Infraestrutura com Auditório", "#009BD4"),
      calc(u => temOpcao(u.estrutura_fisica, "Estúdio de gravação / produção audiovisual (EaD)"), "11. Estúdio Audiovisual / EaD", "#3E9F9B"),
      calc(u => u.plan_A === 1, "12. Indicador A — Planejamento Próprio Vigente", "#D9982B"),
    ];
  }, [unidades, nAtual]);

  return (
    <div>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#00367C", marginBottom: "0.4rem" }}>
          Visão Geral & Síntese dos Indicadores
        </h2>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Recorte analítico consolidado das unidades de formação {ramoSelecionado ? `(${ramoSelecionado})` : "do Poder Judiciário"} · N = {nAtual}
        </p>
      </div>

      {isSmallGroup && <SmallGroupAlert nAtual={nAtual} />}

      {/* Os 6 Achados Centrais do Relatório */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#00367C", marginBottom: "1rem" }}>
          Os 6 Achados Centrais do Diagnóstico Nacional (indicadores nacionais, N = 110)
        </h3>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))", gap: "1rem" }}>
          <div className="finding-box">
            <div className="finding-title">
              <CheckCircle2 size={18} color="#00367C" />
              1. Ampla Adesão e Institucionalização
            </div>
            <div className="finding-body">
              90 dos 91 tribunais no escopo (98,9%) responderam à pesquisa, totalizando 110 unidades em 92 órgãos. 78,2% das unidades possuem natureza formal de escola, coexistindo com 15,5% de setores de capacitação ligados à gestão de pessoas.
            </div>
          </div>

          <div className="finding-box">
            <div className="finding-title">
              <Shield size={18} color="#00367C" />
              2. Instrumentos operacionais e pedagógicos
            </div>
            <div className="finding-body">
              O PAC ({percentualNacional(indicadores, "instrumentos_governanca", "Plano anual de capacitação (PAC) aprovado")}) e o regimento ({percentualNacional(indicadores, "instrumentos_governanca", "Ato normativo / regimento interno próprio")}) são mais frequentes que o projeto pedagógico ({percentualNacional(indicadores, "instrumentos_governanca", "Projeto pedagógico institucional / político-pedagógico")}). Plano estratégico próprio vigente: {percentualNacional(indicadores, "planejamento", "Plano próprio vigente e formalizado")}; referência estratégica mais ampla: 68,2%.
            </div>
          </div>

          <div className="finding-box">
            <div className="finding-title">
              <Laptop size={18} color="#00367C" />
              3. Distribuição digital e produção especializada
            </div>
            <div className="finding-body">
              Disponibilidade de AVA em {percentualNacional(indicadores, "ava_algum", "Dispõe de algum AVA")} das unidades. Moodle citado por {percentualNacional(indicadores, "moodle", "Cita o Moodle como plataforma de AVA")} do total nacional (não apenas entre quem dispõe de AVA). Equipe dedicada em {percentualNacional(indicadores, "capacidade_ead", "Equipe multidisciplinar dedicada, com designer instrucional, audiovisual e TI")}; produção com apoio pontual de outras áreas em {percentualNacional(indicadores, "capacidade_ead", "Produção parcial, com apoio pontual de outras áreas")}.
            </div>
          </div>

          <div className="finding-box">
            <div className="finding-title">
              <GraduationCap size={18} color="#00367C" />
              4. Presença dos quatro níveis de avaliação
            </div>
            <div className="finding-body">
              Aplicação em ao menos parte das ações: reação {percentualNacional(indicadores, "n1_aplica", "Nível 1 (reação) aplicado, em parte ou na maioria das ações")}, aprendizagem {percentualNacional(indicadores, "n2_aplica", "Nível 2 (aprendizagem) aplicado, em parte ou na maioria das ações")}, transferência {percentualNacional(indicadores, "n3_aplica", "Nível 3 (transferência) aplicado, em parte ou na maioria das ações")} e impacto {percentualNacional(indicadores, "n4_aplica", "Nível 4 (impacto) aplicado, em parte ou na maioria das ações")}. A combinação empírica não pressupõe progressão obrigatória entre níveis.
            </div>
          </div>

          <div className="finding-box">
            <div className="finding-title">
              <Users size={18} color="#00367C" />
              5. Formação de formadores
            </div>
            <div className="finding-body">
              Cadastro de formadores declarado por {percentualNacional(indicadores, "cadastro_formadores", "Sim")} das unidades. Programa permanente de formação de formadores em {percentualNacional(indicadores, "formacao_formadores", "Programa permanente com certificação")}, ações pontuais em {percentualNacional(indicadores, "formacao_formadores", "Ações pontuais")} e ausência de iniciativa em {percentualNacional(indicadores, "formacao_formadores", "Não desenvolve")}. Cadastro e banco de talentos são indicadores diferentes.
            </div>
          </div>

          <div className="finding-box">
            <div className="finding-title">
              <Handshake size={18} color="#00367C" />
              6. Interesse na articulação com a ENAJU/CNJ
            </div>
            <div className="finding-body">
              Interesse alto ou moderado em {percentualNacional(indicadores, "interesse_aberto", "Interesse alto ou moderado")} das unidades, com {percentualNacional(indicadores, "interesse", "Alto")} alto e {percentualNacional(indicadores, "interesse", "Moderado")} moderado. Trata-se de disposição declarada, que não equivale a cooperação já implementada.
            </div>
          </div>
        </div>
      </section>

      {/* Gráfico dos 12 Indicadores Estratégicos */}
      <section>
        <ChartCard
          titulo="Os 12 Indicadores Estratégicos Nacionais do Diagnóstico"
          subtitulo="Síntese comparativa dos eixos fundamentais de governança, capacidade, tecnologia e cooperação"
          itens={itensEstrategicos}
          modoAbsoluto={modoAbsoluto}
          metadados={{
            definicao: "Conjunto dos 12 principais indicadores estruturais mapeados pelo questionário nacional.",
            perguntaOrigem: "Questões 9, 11, 12, 15, 26, 33, 37, 40 e 43 do formulário oficial.",
            denominador: `N = ${nAtual} unidades respondentes no recorte selecionado.`,
            regraCalculo: "Percentual de unidades que assinalaram as respectivas opções afirmativas homologadas.",
            limitacao: "Valores autodeclarados pelas unidades respondentes no Ciclo 2025/2026."
          }}
          linkRelatorio={{ capitulo: "Sumário Executivo e Capítulo 11", texto: "Sumário Executivo e Síntese dos Achados" }}
        />
      </section>
    </div>
  );
};
