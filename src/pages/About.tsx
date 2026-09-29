import React from "react";
import { Info, Shield, Users } from "lucide-react";

export const About: React.FC = () => {
  return (
    <div style={{ maxWidth: "850px", margin: "0 auto" }}>
      <div style={{ marginBottom: "2rem" }}>
        <h2 style={{ fontSize: "1.6rem", fontWeight: 800, color: "#00367C", marginBottom: "0.4rem" }}>
          Sobre o Diagnóstico Nacional & Instituições Responsáveis
        </h2>
        <p style={{ color: "#64748B", fontSize: "0.95rem" }}>
          Fundamentos normativos, objetivos institucionais e equipe técnica da ENAJU/CNJ
        </p>
      </div>

      <section style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#00367C", marginBottom: "0.75rem" }}>
          A Escola Nacional do Judiciário (ENAJU)
        </h3>
        <p style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "#334155", marginBottom: "1rem" }}>
          Instituída pela <strong>Resolução CNJ nº 643/2025</strong>, a Escola Nacional do Judiciário (ENAJU) atua como órgão central de articulação pedagógica, formação continuada e inovação educacional para o Poder Judiciário brasileiro. Sua missão compreende o fortalecimento da capacidade institucional das unidades formadoras, o fomento ao compartilhamento solidário de recursos e a promoção de uma cultura de aprendizagem em rede.
        </p>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#00367C", marginBottom: "0.75rem" }}>
          Objetivos do Diagnóstico Nacional
        </h3>
        <p style={{ fontSize: "0.92rem", lineHeight: 1.6, color: "#334155", marginBottom: "1rem" }}>
          O Diagnóstico Nacional das Unidades de Formação foi concebido como um instrumento empírico inédito para mapear as condições reais de governança, infraestrutura física e digital, perfil do corpo docente, maturidade avaliativa e interesses de cooperação em todos os ramos da Justiça brasileira. Os resultados subsidiam a formulação das diretrizes pedagógicas e da agenda formativa nacional da ENAJU para os ciclos 2025/2026.
        </p>
      </section>

      <section style={{ marginBottom: "2.5rem" }}>
        <h3 style={{ fontSize: "1.2rem", fontWeight: 700, color: "#00367C", marginBottom: "0.75rem" }}>
          Expediente Institucional
        </h3>

        <div style={{ background: "#ffffff", border: "1px solid #E2E8F0", borderRadius: "8px", padding: "1.5rem" }}>
          <h4 style={{ color: "#00367C", fontSize: "1rem", marginBottom: "0.5rem" }}>Conselho Nacional de Justiça (CNJ)</h4>
          <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.5, marginBottom: "1rem" }}>
            <strong>Presidente:</strong> Ministro Edson Fachin<br />
            <strong>Corregedor Nacional de Justiça:</strong> Ministro Mauro Campbell Marques<br />
            <strong>Secretária-Geral:</strong> Clara Mota<br />
            <strong>Secretário de Estratégia e Projetos:</strong> Paulo Marcos de Farias<br />
            <strong>Diretor-Geral:</strong> Bruno César de Oliveira Lopes
          </p>

          <h4 style={{ color: "#00367C", fontSize: "1rem", marginBottom: "0.5rem" }}>Escola Nacional do Judiciário (ENAJU)</h4>
          <p style={{ fontSize: "0.85rem", color: "#475569", lineHeight: 1.5 }}>
            <strong>Diretor-Geral:</strong> Dr. Daniel Ribeiro Surdi de Avelar<br />
            <strong>Diretor-Executivo:</strong> Fábio Lopes Fernandes Ramos<br />
            <strong>Coordenação de Desenvolvimento Educacional, Pesquisa e Inovação (CODE):</strong> Igor Caires Machado (Coordenador)<br />
            <strong>Setor de Gestão Acadêmica e de Formação (SEGAF):</strong> Alana Oliveira Viana<br />
            <strong>Setor de Gestão Administrativa e Contratações (SEGAC):</strong> Rodrigo Pereira da Silva
          </p>
        </div>
      </section>

      <section style={{ background: "#F8FAFC", border: "1px solid #E2E8F0", padding: "1.25rem", borderRadius: "8px", fontSize: "0.82rem", color: "#64748B" }}>
        <div><strong>Ambiente Tecnológico:</strong> Aplicação web estática auditável desenvolvida em React + Vite + TypeScript.</div>
        <div><strong>Hospedagem:</strong> GitHub Pages com portabilidade integral para publicação no portal da ENAJU.</div>
      </section>
    </div>
  );
};
