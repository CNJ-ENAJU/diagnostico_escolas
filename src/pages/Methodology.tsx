import React from "react";
import { BookOpen, ShieldCheck, Download, AlertTriangle, FileText } from "lucide-react";

export const Methodology: React.FC = () => {
  return (
    <div style={{ maxWidth: "900px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#00367C", marginBottom: "0.4rem" }}>
          Metodologia, Salvaguardas & Decisões Homologadas
        </h2>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Rastreabilidade científica, governança de dados, regras C02 e proteção de pequenos grupos (R01.1)
        </p>
      </div>

      {/* 1. Unidade de Análise e Universo */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#00367C", marginBottom: "0.75rem" }}>
          1. Arquitetura Conceitual e Unidade de Análise
        </h3>
        <p style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "#334155", marginBottom: "1rem" }}>
          A unidade primária de análise da pesquisa é a <strong>unidade de formação</strong> (e não o tribunal ou o órgão judicial). O universo é composto por <strong>110 unidades respondentes</strong>, sediadas em <strong>92 órgãos do Poder Judiciário</strong>, abrangendo 90 dos 91 tribunais no escopo da pesquisa (todos exceto o STF), além do Conselho da Justiça Federal (CJF) e do Conselho Superior da Justiça do Trabalho (CSJT). O Tribunal de Justiça de Alagoas (TJAL) não enviou resposta ao questionário.
        </p>
        <div style={{ background: "#F1F5F9", padding: "1rem", borderRadius: "6px", fontSize: "0.85rem", color: "#475569" }}>
          <strong>Distinção Terminológica Rigorosa:</strong> <em>Resposta ≠ Unidade de Formação ≠ Tribunal/Órgão</em>. Existem 18 órgãos com duas unidades respondentes distintas (geralmente uma Escola Judicial voltada a magistrados e um setor de capacitação de servidores). Nem toda unidade de formação é uma "Escola Judicial" formalmente instituída (86 são escolas, 17 são setores de capacitação e 7 são centros/núcleos).
        </div>
      </section>

      {/* 2. Decisões Metodológicas C02 */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#00367C", marginBottom: "0.75rem" }}>
          2. Decisões Metodológicas Homologadas (Trilha C02)
        </h3>
        <div style={{ display: "flex", flexDirection: "column", gap: "0.75rem", fontSize: "0.9rem", color: "#334155" }}>
          <div style={{ borderLeft: "3px solid #00367C", paddingLeft: "1rem" }}>
            <strong>1. Inclusão da resposta R110 (TRE-BA):</strong> Recebida em 15/09/2026 após o prazo prorrogado. O teste estatístico de sensibilidade demonstrou que sua inclusão gerou diferença máxima de 1 unidade (0,9 p.p.) e não alterou a ordenação de nenhum ranking de opções.
          </div>
          <div style={{ borderLeft: "3px solid #00367C", paddingLeft: "1rem" }}>
            <strong>2. Superior Tribunal de Justiça (STJ):</strong> Classificado no segmento "Tribunais Superiores e Conselhos" (conforme expressamente previsto no enunciado da Q8), preservando-se sua resposta literal original.
          </div>
          <div style={{ borderLeft: "3px solid #00367C", paddingLeft: "1rem" }}>
            <strong>3. TJDFT agregado à Justiça Estadual:</strong> Nos cortes comparativos entre ramos, o TJDFT integra a Justiça Estadual (elevando o segmento de N=28 para N=29), sendo vedado capítulo com N=1.
          </div>
          <div style={{ borderLeft: "3px solid #00367C", paddingLeft: "1rem" }}>
            <strong>4. Indicadores de Planejamento A e B:</strong> O Indicador A (47,3%) mede exclusivamente plano próprio da escola vigente e formalizado. O Indicador B (68,2%) abrange qualquer referência estratégica formal (incluindo adoção do plano do tribunal). Nunca são somados.
          </div>
          <div style={{ borderLeft: "3px solid #00367C", paddingLeft: "1rem" }}>
            <strong>5. Níveis de Avaliação de Kirkpatrick:</strong> Preservadas as categorias ordinais originais (Não aplica, Em parte das ações, Na maioria das ações), com variável derivada auxiliar para "qualquer aplicação".
          </div>
        </div>
      </section>

      {/* 3. Salvaguarda de Pequenos Grupos (R01.1) */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#00367C", marginBottom: "0.75rem" }}>
          3. Salvaguarda de Pequenos Grupos (Regra R01.1)
        </h3>
        <p style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "#334155", marginBottom: "1rem" }}>
          Para evitar a revelação indireta de respostas institucionais individualizadas e preservar a confidencialidade estatística, adota-se o parâmetro <code>MIN_PUBLIC_GROUP_SIZE = 10</code>.
        </p>
        <ul style={{ paddingLeft: "1.5rem", fontSize: "0.9rem", color: "#475569", lineHeight: 1.6 }}>
          <li>Segmentos com <strong>N ≤ 10 unidades</strong> (Justiça Federal com n=8, Justiça Militar com n=5 e Tribunais Superiores/Conselhos com n=3) têm seus resultados reportados exclusivamente em números absolutos (<code>n de N</code>).</li>
          <li>Quando a combinação de filtros pelo usuário resultar em um subconjunto com N &lt; 10, os gráficos suprimem a visualização desagregada e exibem alerta institucional para ampliação do filtro.</li>
        </ul>
      </section>

      {/* 4. Dados Não Incluídos Nesta Versão */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#00367C", marginBottom: "0.75rem" }}>
          4. Escopo e Dados Bloqueados Nesta Versão
        </h3>
        <div style={{ background: "#FEF3C7", padding: "1.25rem", borderRadius: "8px", border: "1px solid #F59E0B", color: "#92400E", fontSize: "0.88rem", lineHeight: 1.5 }}>
          Esta versão pública do painel baseia-se <strong>exclusivamente nas respostas ao questionário oficial</strong>. Encontram-se taxativamente bloqueados e excluídos do painel:
          <ul style={{ marginTop: "0.5rem", paddingLeft: "1.25rem" }}>
            <li>Anexos documentais enviados pelas escolas (famílias 27A, 31A, 35A, 39 e etapas D01/D02);</li>
            <li>Quantitativos físicos totais de execução de 2025 (ações formativas, carga horária e participantes);</li>
            <li>Respostas abertas qualitativas da questão Q44 (desafios), que aguardam homologação por segundo codificador independente.</li>
          </ul>
        </div>
      </section>

      {/* 5. Como Citar estes Dados (Regra 54) */}
      <section style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#00367C", marginBottom: "0.75rem" }}>
          5. Como Citar estes Dados
        </h3>
        <div style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "1.25rem", borderRadius: "8px", fontSize: "0.85rem", color: "#1E293B", fontFamily: "monospace" }}>
          CONSELHO NACIONAL DE JUSTIÇA (CNJ); ESCOLA NACIONAL DO JUDICIÁRIO (ENAJU). <em>Diagnóstico Nacional das Unidades de Formação do Poder Judiciário: capacidades institucionais, educacionais e perspectivas para uma atuação nacional em rede</em>. Brasília: CNJ/ENAJU, 2026. Disponível em: https://cnj-enaju.github.io/diagnostico_escolas/.
        </div>
      </section>

      {/* Download do Relatório Oficial */}
      <section style={{ textAlign: "center", padding: "2rem", background: "#EFF6FF", borderRadius: "8px", border: "1px solid #BFDBFE" }}>
        <h3 style={{ color: "#1E3A8A", fontSize: "1.2rem", fontWeight: 700, marginBottom: "0.5rem" }}>
          Relatório Técnico Oficial Completo
        </h3>
        <p style={{ fontSize: "0.9rem", color: "#3B82F6", maxWidth: "600px", margin: "0 auto 1.25rem" }}>
          Acesse a íntegra da publicação científica oficial, com o detalhamento de todos os 14 capítulos, figuras vetoriais e apêndices analíticos.
        </p>
        <a 
          href="./assets/relatorio.pdf" 
          download="relatorio_diagnostico_escolas_enaju_2026.pdf" 
          className="btn btn-primary"
          style={{ textDecoration: "none" }}
        >
          <FileText size={16} />
          <span>Baixar Relatório Oficial em PDF</span>
        </a>
      </section>
    </div>
  );
};
