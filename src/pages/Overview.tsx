import React from "react";
import { UnidadePublica, IndicadorCorte } from "../types";
import { ChartCard, ItemGrafico } from "../components/ChartCard";
import { SmallGroupAlert } from "../components/SmallGroupAlert";
import { MIN_PUBLIC_GROUP_SIZE } from "../config";
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
      calc(u => u.instrumentos_governanca.includes("Plano anual de capacitação"), "5. Plano Anual de Capacitação (PAC) Vigente", "#009BD4"),
      calc(u => u.n2_aprendizagem === "Na maioria das ações" || u.n2_aprendizagem === "Em parte das ações", "6. Avaliação de Nível 2 — Aprendizagem", "#0163AC"),
      calc(u => u.cadastro_formadores === "Sim", "7. Cadastro de Formadores / Banco de Talentos", "#3E9F9B"),
      calc(u => u.plan_B === 1, "8. Indicador B — Referência Estratégica Existente", "#D9982B"),
      calc(u => u.parcerias.includes("Sim, com convênios"), "9. Parcerias Formais / Convênios Vigentes", "#3E9F9B"),
      calc(u => u.estrutura_fisica.includes("Auditório"), "10. Infraestrutura com Auditório", "#009BD4"),
      calc(u => u.estrutura_fisica.includes("Estúdio"), "11. Estúdio Audiovisual / EaD", "#3E9F9B"),
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
          Os 6 Achados Centrais do Diagnóstico Nacional
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
              2. PAC como Eixo Normativo Dominante
            </div>
            <div className="finding-body">
              O Plano Anual de Capacitação (74,5%) e o Regimento Interno (63,6%) superam amplamente o Projeto Pedagógico Institucional (36,4%). Há descompasso entre o planejamento próprio formalizado (47,3%) e a referência estratégica geral (68,2%).
            </div>
          </div>

          <div className="finding-box">
            <div className="finding-title">
              <Laptop size={18} color="#00367C" />
              3. Ecossistema Digital Consolidado, mas Heterogêneo
            </div>
            <div className="finding-body">
              95,5% das unidades contam com AVA (com 90,0% utilizando Moodle), porém apenas 26,4% dispõem de equipe multidisciplinar dedicada para produção EaD, dependendo a maioria (51,8%) de apoios parciais de outras secretarias.
            </div>
          </div>

          <div className="finding-box">
            <div className="finding-title">
              <GraduationCap size={18} color="#00367C" />
              4. A Escada Avaliativa de Kirkpatrick
            </div>
            <div className="finding-body">
              Forte concentração na avaliação de reação (97,3%) e aprendizagem (72,7%), com acentuada queda nos níveis de transferência para o trabalho (40,9%) e impacto organizacional (34,5%), e pesquisa com egressos em apenas 16,4%.
            </div>
          </div>

          <div className="finding-box">
            <div className="finding-title">
              <Users size={18} color="#00367C" />
              5. Profissionalização Docente em Construção
            </div>
            <div className="finding-body">
              70,9% mantêm cadastro de docentes atualizado, mas apenas 30,9% oferecem programa permanente de formação de formadores, predominando ações pontuais (46,4%) e heterogeneidade nos critérios de retribuição e avaliação.
            </div>
          </div>

          <div className="finding-box">
            <div className="finding-title">
              <Handshake size={18} color="#00367C" />
              6. Disposição Quase Unânime para Rede ENAJU
            </div>
            <div className="finding-body">
              99,1% das unidades manifestaram interesse positivo (76,4% alto e 22,7% moderado) em cooperar ativamente com a ENAJU/CNJ, priorizando o compartilhamento de vagas em cursos, coprodução de conteúdos e redes nacionais.
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
          linkRelatorio={{ capitulo: "Capítulo 1 e Capítulo 12", texto: "Sumário Executivo e Síntese dos Achados" }}
        />
      </section>
    </div>
  );
};
